/*
  # Fix Course Seeding Function - Remove Variable Ambiguity

  Updates the seed_course_modules_lessons function to fix column reference ambiguity
  by using qualified variable names.
*/

CREATE OR REPLACE FUNCTION public.seed_course_modules_lessons(
  p_course_slug text,
  p_modules jsonb,
  p_replace boolean default false
) RETURNS void
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
DECLARE
  c_id uuid;
  m jsonb;
  mod_index int := 0;
  v_module_id uuid;
  lesson_title text;
  v_lesson_index int;
BEGIN
  SELECT id INTO c_id FROM public.courses WHERE slug = p_course_slug;
  IF c_id IS NULL THEN
    RAISE EXCEPTION 'Course slug not found: %', p_course_slug;
  END IF;

  IF p_replace THEN
    DELETE FROM public.course_lessons
    WHERE module_id IN (SELECT id FROM public.course_modules WHERE course_id = c_id);
    DELETE FROM public.course_modules WHERE course_id = c_id;
  END IF;

  FOR m IN SELECT * FROM jsonb_array_elements(p_modules)
  LOOP
    mod_index := mod_index + 1;

    INSERT INTO public.course_modules(course_id, module_index, title, description)
    VALUES (
      c_id,
      mod_index,
      coalesce(m->>'title','Module '||mod_index),
      m->>'desc'
    )
    ON CONFLICT (course_id, module_index) DO UPDATE
      SET title = excluded.title,
          description = excluded.description
    RETURNING id INTO v_module_id;

    v_lesson_index := 0;
    FOR lesson_title IN SELECT * FROM jsonb_array_elements_text(coalesce(m->'lessons','[]'::jsonb))
    LOOP
      v_lesson_index := v_lesson_index + 1;

      INSERT INTO public.course_lessons(module_id, lesson_index, title)
      VALUES (v_module_id, v_lesson_index, lesson_title)
      ON CONFLICT (module_id, lesson_index) DO UPDATE
        SET title = excluded.title;
    END LOOP;
  END LOOP;
END $$;
