from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from .serializers import PredictRequestSerializer, PredictWithFilesSerializer
from matcher.ml.predictor import predict_match
from matcher.ml.file_extractor import FileExtractor, FileExtractionError
from matcher.ml.preprocessor import TextPreprocessor
import traceback


def _process_prediction(cv_text: str, jd_text: str) -> Response:
    """
    Helper function to process prediction after text extraction
    """
    try:
        # Preprocess texts
        cv_preprocessed = TextPreprocessor.preprocess_cv(cv_text)
        jd_preprocessed = TextPreprocessor.preprocess_jd(jd_text)
        
        # Validate preprocessed texts
        cv_valid, cv_error = TextPreprocessor.validate_preprocessed_text(cv_preprocessed)
        jd_valid, jd_error = TextPreprocessor.validate_preprocessed_text(jd_preprocessed)
        
        if not cv_valid:
            return Response(
                {'error': 'CV validation failed', 'details': cv_error},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not jd_valid:
            return Response(
                {'error': 'JD validation failed', 'details': jd_error},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get prediction from ML model (use cleaned text)
        result = predict_match(cv_preprocessed['cleaned'], jd_preprocessed['cleaned'])
        
        # Return result with preprocessing statistics (no database save)
        response_data = {
            'skill_match': result['skill_match'],
            'experience_match': result['experience_match'],
            'education_match': result['education_match'],
            'semantic_similarity': result['semantic_similarity'],
            'overall_match': result['overall_match'],
            'preprocessing': {
                'cv_stats': TextPreprocessor.get_preprocessing_stats(cv_text),
                'jd_stats': TextPreprocessor.get_preprocessing_stats(jd_text)
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {
                'error': 'Error processing prediction',
                'details': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class PredictionView(APIView):
    """
    API endpoint for CV-JD matching predictions (stateless)
    """
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        """
        Predict CV-JD match scores (text only)
        
        Expected POST data:
        {
            "cv_text": "...",
            "jd_text": "..."
        }
        """
        try:
            print(f"Received request data: {request.data}")
            serializer = PredictRequestSerializer(data=request.data)
            
            if serializer.is_valid():
                cv_text = serializer.validated_data.get('cv_text', '').strip()
                jd_text = serializer.validated_data.get('jd_text', '').strip()
                
                if not cv_text or not jd_text:
                    return Response(
                        {'error': 'Both CV and JD text are required'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                return _process_prediction(cv_text, jd_text)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"ERROR in PredictionView.post: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': 'Internal server error', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FileUploadPredictionView(APIView):
    """
    API endpoint for CV-JD matching with file uploads (stateless)
    """
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        """
        Predict CV-JD match scores with file upload support
        
        Expected POST data (multipart/form-data):
        - cv_file: (optional) PDF, DOCX, TXT, PPTX file
        - cv_text: (optional) Plain text
        - jd_file: (optional) PDF, DOCX, TXT, PPTX file
        - jd_text: (optional) Plain text
        
        At least one input must be provided for each (file or text)
        """
        serializer = PredictWithFilesSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Extract CV text
                cv_text = serializer.validated_data.get('cv_text', '').strip()
                cv_file = serializer.validated_data.get('cv_file')
                
                if cv_file:
                    cv_text = FileExtractor.extract_text(cv_file)
                
                # Extract JD text
                jd_text = serializer.validated_data.get('jd_text', '').strip()
                jd_file = serializer.validated_data.get('jd_file')
                
                if jd_file:
                    jd_text = FileExtractor.extract_text(jd_file)
                
                if not cv_text or not jd_text:
                    return Response(
                        {'error': 'Failed to extract text from files'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                return _process_prediction(cv_text, jd_text)
                
            except FileExtractionError as e:
                return Response(
                    {
                        'error': 'File extraction error',
                        'details': str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {
                        'error': 'Error processing files',
                        'details': str(e)
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def supported_formats(request):
    """Get list of supported file formats"""
    return Response({
        'file_formats': {
            'pdf': 'Adobe PDF',
            'docx': 'Microsoft Word (.docx)',
            'doc': 'Microsoft Word (.doc)',
            'txt': 'Plain Text',
            'pptx': 'PowerPoint Presentation'
        },
        'max_file_size_mb': 10,
        'text_modes': ['text_input', 'file_upload', 'both']
    })
