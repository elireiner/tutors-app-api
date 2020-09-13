DROP TABLE IF EXISTS tutors_subjects;
CREATE TABLE tutors_subjects (
      subjects_id int REFERENCES subjects (subject_id) ON DELETE CASCADE,
      user_id int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
      CONSTRAINT tutors_subjects_pkey PRIMARY KEY (subjects_id, user_id)
);