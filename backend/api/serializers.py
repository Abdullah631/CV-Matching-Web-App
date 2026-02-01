from rest_framework import serializers


class PredictRequestSerializer(serializers.Serializer):
    """Serializer for CV-JD matching prediction requests (text only)"""
    cv_text = serializers.CharField(max_length=50000, required=True, allow_blank=False)
    jd_text = serializers.CharField(max_length=50000, required=True, allow_blank=False)

    def validate_cv_text(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("CV text must be at least 10 characters long")
        return value
    
    def validate_jd_text(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Job description must be at least 10 characters long")
        return value


class PredictWithFilesSerializer(serializers.Serializer):
    """Serializer for CV-JD matching prediction with file uploads"""
    cv_file = serializers.FileField(required=False, allow_null=True)
    cv_text = serializers.CharField(max_length=50000, required=False, allow_blank=True)
    
    jd_file = serializers.FileField(required=False, allow_null=True)
    jd_text = serializers.CharField(max_length=50000, required=False, allow_blank=True)

    def validate(self, data):
        """Validate that at least one input is provided for each document type"""
        # Validate CV
        cv_file = data.get('cv_file')
        cv_text = data.get('cv_text', '').strip()

        if not cv_file and not cv_text:
            raise serializers.ValidationError(
                "CV: Please provide either a file or text"
            )

        # Validate JD
        jd_file = data.get('jd_file')
        jd_text = data.get('jd_text', '').strip()

        if not jd_file and not jd_text:
            raise serializers.ValidationError(
                "Job Description: Please provide either a file or text"
            )

        # Validate file sizes if provided
        max_file_size = 10 * 1024 * 1024  # 10MB
        
        if cv_file and cv_file.size > max_file_size:
            raise serializers.ValidationError(
                f"CV file too large. Maximum {max_file_size / (1024*1024):.0f}MB allowed"
            )
        
        if jd_file and jd_file.size > max_file_size:
            raise serializers.ValidationError(
                f"JD file too large. Maximum {max_file_size / (1024*1024):.0f}MB allowed"
            )

        # Validate text length if provided
        if cv_text and len(cv_text) < 10:
            raise serializers.ValidationError("CV text must be at least 10 characters long")
        
        if jd_text and len(jd_text) < 10:
            raise serializers.ValidationError("Job description must be at least 10 characters long")

        return data
