BEGIN

CREATE TABLE records (
   id SERIAL PRIMARY KEY,
   firma TEXT,
   titel TEXT,
   job_id TEXT,
   volltext TEXT,
   plz_arbeitsort INTEGER,
   arbeitsort TEXT,
   vondatum TEXT,
   stellenlink TEXT,
   jobtype TEXT,
   category TEXT
);


END$$;


SELECT * FROM mytable;