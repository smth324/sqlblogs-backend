 CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes INT DEFAULT 0 );
 insert into blogs  (author, url, title) values ('william','google.com','williamblog2');
 insert into blogs  (author, url, title, likes) values ('william','google.com','williamblog',5);
 
 