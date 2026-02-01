"""
Text preprocessing utilities for CV and JD normalization
"""

import re
from typing import Optional


class TextPreprocessor:
    """Preprocess and normalize text for matching"""

    # Common sections in CVs
    CV_SECTIONS = {
        'contact': ['contact', 'email', 'phone', 'address', 'linkedin'],
        'objective': ['objective', 'summary', 'profile', 'about'],
        'experience': ['experience', 'employment', 'work', 'career'],
        'education': ['education', 'degree', 'qualification', 'university', 'school'],
        'skills': ['skills', 'technical', 'expertise', 'competencies'],
        'projects': ['projects', 'portfolio', 'work sample'],
        'certifications': ['certification', 'certificate', 'certified', 'course'],
    }

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and normalize text
        - Remove extra whitespace
        - Remove special characters (but keep spaces between words)
        - Normalize case
        """
        if not text:
            return ""

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove HTML tags if any
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', '', text)
        
        # Keep common punctuation for sentence structure but remove others
        text = re.sub(r'[^a-zA-Z0-9\s\.\,\-\(\)]', ' ', text)
        
        # Remove extra spaces again
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize text to lowercase"""
        return text.lower()

    @staticmethod
    def extract_key_sections(text: str) -> dict:
        """
        Extract and categorize key sections from CV
        Returns: dict with section names as keys and extracted text as values
        """
        sections = {
            'experience': "",
            'skills': "",
            'education': "",
            'certifications': "",
            'full_text': text
        }

        text_lower = text.lower()
        lines = text.split('\n')

        current_section = 'full_text'

        for line in lines:
            line_lower = line.lower()

            # Detect section headers
            for section_key, keywords in TextPreprocessor.CV_SECTIONS.items():
                if any(keyword in line_lower for keyword in keywords):
                    if section_key in sections:
                        current_section = section_key
                    break

            # Add content to current section
            if current_section in sections and current_section != 'full_text':
                sections[current_section] += line + " "

        # Clean sections
        for key in sections:
            if key != 'full_text':
                sections[key] = sections[key].strip()

        return sections

    @staticmethod
    def preprocess_cv(text: str) -> dict:
        """
        Complete preprocessing for CV
        Returns: dict with preprocessed text and metadata
        """
        # Store original for reference
        original_text = text

        # Clean text
        cleaned_text = TextPreprocessor.clean_text(text)

        # Normalize to lowercase
        normalized_text = TextPreprocessor.normalize_text(cleaned_text)

        # Extract sections
        sections = TextPreprocessor.extract_key_sections(cleaned_text)

        return {
            'original': original_text,
            'cleaned': cleaned_text,
            'normalized': normalized_text,
            'sections': sections,
            'length': len(cleaned_text),
            'word_count': len(cleaned_text.split())
        }

    @staticmethod
    def preprocess_jd(text: str) -> dict:
        """
        Complete preprocessing for Job Description
        Returns: dict with preprocessed text and metadata
        """
        # Store original for reference
        original_text = text

        # Clean text
        cleaned_text = TextPreprocessor.clean_text(text)

        # Normalize to lowercase
        normalized_text = TextPreprocessor.normalize_text(cleaned_text)

        # Extract key sections
        sections = {
            'full_text': cleaned_text,
            'requirements': "",
            'responsibilities': "",
            'benefits': "",
        }

        # Try to extract requirements section
        text_lower = cleaned_text.lower()
        if 'requirement' in text_lower:
            # Find requirements section
            req_idx = text_lower.find('requirement')
            next_section_idx = len(cleaned_text)
            
            # Find next major section
            for keyword in ['responsibility', 'benefit', 'qualification', 'about']:
                idx = text_lower.find(keyword, req_idx)
                if idx > req_idx and idx < next_section_idx:
                    next_section_idx = idx
            
            sections['requirements'] = cleaned_text[req_idx:next_section_idx]

        if 'responsibility' in text_lower:
            resp_idx = text_lower.find('responsibility')
            next_section_idx = len(cleaned_text)
            
            for keyword in ['requirement', 'benefit', 'qualification', 'about']:
                idx = text_lower.find(keyword, resp_idx)
                if idx > resp_idx and idx < next_section_idx:
                    next_section_idx = idx
            
            sections['responsibilities'] = cleaned_text[resp_idx:next_section_idx]

        return {
            'original': original_text,
            'cleaned': cleaned_text,
            'normalized': normalized_text,
            'sections': sections,
            'length': len(cleaned_text),
            'word_count': len(cleaned_text.split())
        }

    @staticmethod
    def validate_preprocessed_text(preprocessed: dict, min_length: int = 10) -> tuple:
        """
        Validate preprocessed text
        Returns: (is_valid, error_message)
        """
        if not preprocessed:
            return False, "No text provided"

        if len(preprocessed['cleaned']) < min_length:
            return False, f"Text too short. Minimum {min_length} characters required."

        if preprocessed['word_count'] < 3:
            return False, "Text contains too few words."

        return True, ""

    @staticmethod
    def get_preprocessing_stats(text: str) -> dict:
        """Get statistics about the text"""
        cleaned = TextPreprocessor.clean_text(text)
        words = cleaned.split()
        
        return {
            'original_length': len(text),
            'cleaned_length': len(cleaned),
            'word_count': len(words),
            'average_word_length': sum(len(w) for w in words) / len(words) if words else 0,
            'unique_words': len(set(words)),
            'has_contact_info': bool(re.search(r'[^@]+@[^@]+\.[^@]+', text)),
            'has_phone': bool(re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', text)),
        }
