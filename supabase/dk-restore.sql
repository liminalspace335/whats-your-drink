-- Load the backup payload (exported from the recovery project, whose tables still have the old names)
-- into the _dk tables. Run supabase/dk.sql first. Paste the payload between the two $dkpayload$ markers below (keep both markers).
create temp table _dk (d jsonb);
insert into _dk values ($dkpayload$PASTE_HERE$dkpayload$::jsonb);

insert into public.questions_dk        select * from jsonb_populate_recordset(null::public.questions_dk,        (select d->'questions' from _dk))        on conflict do nothing;
insert into public.question_options_dk select * from jsonb_populate_recordset(null::public.question_options_dk, (select d->'question_options' from _dk)) on conflict do nothing;
insert into public.result_types_dk     select * from jsonb_populate_recordset(null::public.result_types_dk,     (select d->'result_types' from _dk))     on conflict do nothing;
insert into public.branding_dk         select * from jsonb_populate_recordset(null::public.branding_dk,         (select d->'branding' from _dk))         on conflict do nothing;
insert into public.submissions_dk      select * from jsonb_populate_recordset(null::public.submissions_dk,      (select d->'submissions' from _dk))      on conflict do nothing;
insert into public.referral_visits_dk  select * from jsonb_populate_recordset(null::public.referral_visits_dk,  (select d->'referral_visits' from _dk))  on conflict do nothing;
insert into public.translations_dk     select * from jsonb_populate_recordset(null::public.translations_dk,     (select d->'translations' from _dk))     on conflict do nothing;
drop table _dk;

select 'questions' t, count(*) from public.questions_dk
union all select 'question_options', count(*) from public.question_options_dk
union all select 'result_types', count(*) from public.result_types_dk
union all select 'branding', count(*) from public.branding_dk
union all select 'submissions', count(*) from public.submissions_dk
union all select 'referral_visits', count(*) from public.referral_visits_dk
union all select 'translations_' || locale, count(*) from public.translations_dk group by locale
order by 1;
