# File Upload Feature Guide

## Overview

The CV-JD Matcher now supports **file uploads** for both CVs and Job Descriptions, in addition to text input. Users can upload documents in multiple formats, and the system automatically extracts text and preprocesses it before analysis.

## Supported File Formats

| Format | Extension | Status | Details |
|--------|-----------|--------|---------|
| **PDF** | `.pdf` | ✅ Supported | Text extraction via PyPDF2 |
| **Word** | `.docx`, `.doc` | ✅ Supported | Text extraction via python-docx |
| **PowerPoint** | `.pptx` | ✅ Supported | Text extraction via python-pptx |
| **Plain Text** | `.txt` | ✅ Supported | Direct text reading |

## File Constraints

- **Maximum File Size**: 10 MB
- **Supported Formats**: PDF, DOCX, DOC, TXT, PPTX
- **File Validation**: Performed on both frontend and backend

## Frontend Features

### 1. **Dual Input Modes**

Users can choose between:
- **Text Input** (📝) - Paste text directly
- **File Upload** (📄) - Upload document files

```javascript
// Mode toggle for CV
<label>
  <input type="radio" value="text" checked={cvMode === 'text'} />
  📝 Text Input
</label>
<label>
  <input type="radio" value="file" checked={cvMode === 'file'} />
  📄 File Upload
</label>
```

### 2. **Drag and Drop Support**

Users can drag files directly into the upload area:

```
┌─────────────────────────────────┐
│  Drag and drop your CV here     │
│           or                     │
│     Click to browse files       │
│                                 │
│ Supported: PDF, DOCX, TXT, ... │
└─────────────────────────────────┘
```

### 3. **File Validation**

**Frontend Validation:**
- File format checking (extension-based)
- File size validation (10MB limit)
- User-friendly error messages

**Example:**
```javascript
const validation = validateFile(file);
if (!validation.valid) {
  setError(`CV: ${validation.error}`);
}
```

### 4. **Visual Feedback**

- ✅ Shows selected filename and file size
- 🎨 Highlights upload area on drag
- ⚠️ Clear error messages
- ⏳ Loading state during processing

## Backend API Endpoints

### `/api/matches/predict_with_files/` (POST)

**Request Format:**
```
Content-Type: multipart/form-data
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cv_text` | string | Either text or file | CV text content |
| `cv_file` | file | Either text or file | CV document file |
| `jd_text` | string | Either text or file | Job description text |
| `jd_file` | file | Either text or file | Job description file |

**Example Request:**

```bash
curl -X POST http://localhost:8000/api/matches/predict_with_files/ \
  -F "cv_file=@resume.pdf" \
  -F "jd_file=@job_posting.docx"
```

**Response:**

```json
{
  "overall_match": 75,
  "skill_match": 82,
  "experience_match": 70,
  "education_match": 68,
  "semantic_similarity": 73,
  "preprocessing_stats": {
    "cv": {
      "original_length": 3456,
      "cleaned_length": 2890,
      "sections_found": ["experience", "skills", "education"]
    },
    "jd": {
      "original_length": 2345,
      "cleaned_length": 1950,
      "sections_found": ["requirements", "responsibilities"]
    }
  }
}
```

## Backend Processing Pipeline

### 1. **File Extraction** (`file_extractor.py`)

```
Input File → Format Detection → Text Extraction → Cleaned Text
```

**Supported Formats:**
- **PDF**: Uses `PyPDF2` to extract text from all pages
- **DOCX/DOC**: Uses `python-docx` for paragraph and table extraction
- **PPTX**: Uses `python-pptx` to extract slide text
- **TXT**: Direct file reading with encoding detection

**Example:**
```python
from matcher.ml.file_extractor import FileExtractor

extractor = FileExtractor()
text = extractor.extract_text(uploaded_file, file_extension='pdf')
```

### 2. **Text Preprocessing** (`preprocessor.py`)

```
Raw Text → Cleaning → Normalization → Section Detection → Validated Text
```

**Processing Steps:**

1. **Cleaning:**
   - Remove URLs and email addresses
   - Remove phone numbers
   - Remove extra whitespace

2. **Normalization:**
   - Convert to lowercase
   - Standardize spacing

3. **Section Detection:**
   - **CV Sections**: Experience, Skills, Education, Certifications, Objective, Languages
   - **JD Sections**: Requirements, Responsibilities, Benefits, Qualifications

4. **Validation:**
   - Check text quality
   - Generate preprocessing statistics

**Example:**
```python
from matcher.ml.preprocessor import TextPreprocessor

preprocessor = TextPreprocessor()
cleaned_text = preprocessor.preprocess_cv(raw_text)
sections = preprocessor.extract_key_sections(raw_text, doc_type='cv')
stats = preprocessor.get_preprocessing_stats(raw_text)
```

### 3. **Preprocessing Statistics**

The system returns detailed statistics about text processing:

```json
{
  "preprocessing_stats": {
    "cv": {
      "original_length": 3456,
      "cleaned_length": 2890,
      "word_count": 450,
      "sections_found": ["experience", "skills", "education"]
    },
    "jd": {
      "original_length": 2345,
      "cleaned_length": 1950,
      "word_count": 320,
      "sections_found": ["requirements", "responsibilities"]
    }
  }
}
```

## Implementation Details

### Frontend Component: `MatcherForm.js`

**Key Features:**
- Manages two upload areas (CV and JD)
- Validates files before submission
- Handles both text and file inputs
- Sends `multipart/form-data` POST request
- Displays preprocessing feedback

**Key Functions:**
```javascript
// File validation
const validateFile = (file) => { /* ... */ }

// Drag and drop handling
const handleCvDrop = (e) => { /* ... */ }
const handleJdDrop = (e) => { /* ... */ }

// Form submission
const handleSubmit = async (e) => {
  const formData = new FormData();
  if (cvMode === 'text') {
    formData.append('cv_text', cvText);
  } else {
    formData.append('cv_file', cvFile);
  }
  // ... similar for JD
  
  await axios.post(
    'http://localhost:8000/api/matches/predict_with_files/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}
```

### Backend View: `api/views.py`

**Key Functions:**
```python
@action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
def predict_with_files(self, request):
    """
    Handle predictions with file uploads and/or text input.
    Automatically extracts text from files and preprocesses.
    """
    serializer = PredictWithFilesSerializer(data=request.data)
    if serializer.is_valid():
        cv_text = serializer.validated_data.get('cv_text', '')
        jd_text = serializer.validated_data.get('jd_text', '')
        
        # Extract text from files if provided
        if cv_file := serializer.validated_data.get('cv_file'):
            cv_text = FileExtractor().extract_text(cv_file, cv_file.name)
        
        if jd_file := serializer.validated_data.get('jd_file'):
            jd_text = FileExtractor().extract_text(jd_file, jd_file.name)
        
        # Preprocess text
        cv_preprocessor = TextPreprocessor()
        jd_preprocessor = TextPreprocessor()
        
        cv_cleaned = cv_preprocessor.preprocess_cv(cv_text)
        jd_cleaned = jd_preprocessor.preprocess_jd(jd_text)
        
        # Get statistics
        preprocessing_stats = {
            'cv': cv_preprocessor.get_preprocessing_stats(cv_text),
            'jd': jd_preprocessor.get_preprocessing_stats(jd_text),
        }
        
        # Run prediction and return with stats
        return Response({
            'overall_match': score,
            'preprocessing_stats': preprocessing_stats,
            # ... other scores
        })
```

## Usage Examples

### Example 1: Upload Both Files

```javascript
// User uploads resume.pdf and job_posting.docx
const formData = new FormData();
formData.append('cv_file', resumeFile);
formData.append('jd_file', jobFile);

const response = await axios.post(
  'http://localhost:8000/api/matches/predict_with_files/',
  formData
);
```

### Example 2: Mix of Text and File

```javascript
// User provides CV as text, but uploads JD file
const formData = new FormData();
formData.append('cv_text', userCVText);
formData.append('jd_file', jobFile);

const response = await axios.post(
  'http://localhost:8000/api/matches/predict_with_files/',
  formData
);
```

### Example 3: Text Only

```javascript
// User provides both CV and JD as text (backward compatible)
const formData = new FormData();
formData.append('cv_text', userCVText);
formData.append('jd_text', userJDText);

const response = await axios.post(
  'http://localhost:8000/api/matches/predict_with_files/',
  formData
);
```

## Error Handling

### Frontend Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| "Unsupported format" | File not in allowed formats | Use PDF, DOCX, TXT, or PPTX |
| "File too large" | Exceeds 10MB limit | Use smaller files or compress |
| "No file selected" | User forgot to select file | Click/drag file to upload area |

### Backend Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| "Invalid file format" | File corrupted or wrong type | Try re-saving the file |
| "Text extraction failed" | Error reading file content | Check file integrity |
| "Please enter CV text" | Both CV text and file missing | Provide CV in either format |

## Performance Considerations

### File Processing Times

| Format | Typical Time | Max File Size |
|--------|------------|---|
| PDF (10 pages) | 1-2 seconds | 10 MB |
| DOCX | <1 second | 10 MB |
| PPTX (20 slides) | 1-2 seconds | 10 MB |
| TXT | <0.5 seconds | 10 MB |

### Optimization Tips

1. **Reduce File Size:**
   - Remove images from PDFs before uploading
   - Use compressed Word documents
   - Keep presentation files clean

2. **Format Selection:**
   - PDFs: Good for preserved formatting
   - DOCX: Fastest and most reliable
   - TXT: Smallest file size

3. **Text Preprocessing:**
   - Automatically handles malformed text
   - Removes unnecessary whitespace
   - Normalizes common formatting issues

## Security Features

### File Validation

✅ **Extension Validation:** Only allowed formats
✅ **Size Validation:** Max 10MB per file
✅ **Content Type Checking:** Validates file content
✅ **Temporary File Cleanup:** Auto-deletion after processing

### Example from Backend:

```python
def validate_file(self, file):
    """Validate file before extraction"""
    
    # Check size
    if file.size > 10 * 1024 * 1024:
        raise FileExtractionError(f"File exceeds 10MB limit")
    
    # Check extension
    allowed = ['.pdf', '.docx', '.doc', '.txt', '.pptx']
    if not any(file.name.lower().endswith(ext) for ext in allowed):
        raise FileExtractionError(f"Unsupported file format")
    
    # Validate content
    # ... additional checks ...
```

## Testing the Feature

### Manual Testing Checklist

- [ ] Upload PDF resume → Verify text extraction
- [ ] Upload DOCX job description → Verify text extraction
- [ ] Upload files larger than 10MB → Should show error
- [ ] Try unsupported format (e.g., `.exe`) → Should show error
- [ ] Drag and drop file onto upload area → Should accept
- [ ] Mix text and file inputs → Should work
- [ ] Check preprocessing stats in results → Should display

### Example Test Files

1. **test_resume.pdf** - Sample CV in PDF format
2. **test_job_posting.docx** - Sample JD in Word format
3. **test_text.txt** - Sample CV in plain text

## Future Enhancements

🔮 **Planned Features:**
- [ ] Support for `.doc` (legacy Word) format
- [ ] Support for `.odt` (OpenDocument) format
- [ ] Support for `.pages` (Apple Pages) format
- [ ] OCR support for scanned PDFs
- [ ] Automatic section mapping and enhancement
- [ ] File preview before upload
- [ ] Batch processing multiple files

## Troubleshooting

### Issue: "Text extraction failed"

**Cause:** PDF is scanned image without text layer
**Solution:** Use OCR-enabled PDF or convert to text

### Issue: File upload hangs

**Cause:** Large file or slow network
**Solution:** Reduce file size or use faster connection

### Issue: Missing preprocessing stats

**Cause:** Using old text-only endpoint
**Solution:** Use new `/predict_with_files/` endpoint

## Related Documentation

- [API Documentation](API.md)
- [Backend Setup Guide](QUICKSTART.md)
- [ML Model Information](ML_MODEL.md)
- [Component Documentation](COMPONENTS.md)
