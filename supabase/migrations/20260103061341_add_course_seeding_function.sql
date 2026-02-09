/*
  # Course Seeding Function

  1. New Functions
    - `seed_course_modules_lessons()` - Reusable function to seed course modules and lessons
    - Accepts course slug, modules JSON, and replace flag
    - Automatically handles module and lesson creation/updates

  2. Purpose
    - Provides a clean, maintainable way to seed all course content
    - Supports idempotent operations (can be run multiple times safely)
    - Makes course content updates simple and traceable
*/

create or replace function public.seed_course_modules_lessons(
  p_course_slug text,
  p_modules jsonb,              -- [{ "title": "...", "desc": "...", "lessons": ["..",".."] }, ...]
  p_replace boolean default false
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  c_id uuid;
  m jsonb;
  mod_index int := 0;
  module_id uuid;
  lesson_title text;
  lesson_index int;
begin
  select id into c_id from public.courses where slug = p_course_slug;
  if c_id is null then
    raise exception 'Course slug not found: %', p_course_slug;
  end if;

  if p_replace then
    delete from public.course_lessons
    where module_id in (select id from public.course_modules where course_id = c_id);
    delete from public.course_modules where course_id = c_id;
  end if;

  for m in select * from jsonb_array_elements(p_modules)
  loop
    mod_index := mod_index + 1;

    insert into public.course_modules(course_id, module_index, title, description)
    values (
      c_id,
      mod_index,
      coalesce(m->>'title','Module '||mod_index),
      m->>'desc'
    )
    on conflict (course_id, module_index) do update
      set title = excluded.title,
          description = excluded.description
    returning id into module_id;

    lesson_index := 0;
    for lesson_title in select * from jsonb_array_elements_text(coalesce(m->'lessons','[]'::jsonb))
    loop
      lesson_index := lesson_index + 1;

      insert into public.course_lessons(module_id, lesson_index, title)
      values (module_id, lesson_index, lesson_title)
      on conflict (module_id, lesson_index) do update
        set title = excluded.title;
    end loop;
  end loop;
end $$;
