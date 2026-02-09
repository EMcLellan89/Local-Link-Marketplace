#!/usr/bin/env python3
"""
Generate comprehensive academy lessons for all courses
"""

# Course structures with modules and lesson titles
MERCHANT_COURSES = {
    "local-customers-on-autopilot": {
        "modules": [
            {
                "title": "The Local-Link System",
                "lessons": [
                    "How Local-Link Generates Customers Without Ads",
                    "The Customer Journey on Local-Link",
                    "Why Customers Choose Marketplace Businesses",
                    "Success Metrics That Matter"
                ]
            },
            {
                "title": "Setting Up Your Profile",
                "lessons": [
                    "Profile Optimization Checklist",
                    "Photos That Convert",
                    "Writing Your Business Description",
                    "Service Area & Availability Setup"
                ]
            }
        ]
    },
    # Add more courses...
}

# Generate SQL for lessons
def generate_lesson_insert(course_slug, module_index, lesson_index, lesson_title):
    slug = lesson_title.lower().replace(" ", "-").replace("&", "and")
    content = f"""# {lesson_title}

## Overview

[Comprehensive lesson content here]

## Key Takeaways

- Actionable point 1
- Actionable point 2
- Actionable point 3

## Action Steps

1. Step one
2. Step two
3. Step three

## Next Steps

Continue to the next lesson to learn more.
"""
   
    return f"""
INSERT INTO academy_lessons (module_id, course_id, slug, title, display_order, content_markdown, est_minutes, is_preview)
SELECT
  m.id,
  c.id,
  '{slug}',
  '{lesson_title}',
  {lesson_index},
  $${content}$$,
  15,
  {str(lesson_index == 1).lower()}
FROM academy_courses c
JOIN academy_modules m ON m.course_id = c.id
WHERE c.slug = '{course_slug}'
  AND m.display_order = {module_index}
LIMIT 1;
"""

print("-- Generated lesson inserts")
print("-- Run this to create all lessons")

