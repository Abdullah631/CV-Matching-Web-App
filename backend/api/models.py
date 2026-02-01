from django.db import models


class MatchResult(models.Model):
    """Store CV-JD matching results"""
    cv_text = models.TextField()
    jd_text = models.TextField()
    skill_match = models.FloatField()
    experience_match = models.FloatField()
    education_match = models.FloatField()
    semantic_similarity = models.FloatField()
    overall_match = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Match Result - {self.overall_match}% at {self.created_at}"
