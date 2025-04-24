-- +goose Up

-- +goose StatementBegin
WITH updated_productions AS (
    SELECT id, row_number() over(order by id) as i
    FROM productions
    WHERE deleted_at IS NULL
    ORDER BY id
)
UPDATE productions
SET entity_name = CASE up.i
    WHEN 1 THEN 'Below the Belt'
    WHEN 2 THEN 'Chatty Broads Podcast'
    WHEN 3 THEN 'Chatty Broads with Bekah and Jess Podcast'
    WHEN 4 THEN 'Chatty Broads-Radio'
    WHEN 5 THEN 'Giant Bombcast'
    WHEN 6 THEN 'Good Cult'
    WHEN 7 THEN 'Good For You'
    WHEN 8 THEN 'Good For You with Whitney Cummings'
    WHEN 9 THEN 'Good For You-Radio'
    WHEN 10 THEN 'Hawk v Wolf'
    WHEN 11 THEN 'Hawk vs Wolf Podcast'
    WHEN 12 THEN 'Hawk Vs Wolf-Radio'
    WHEN 13 THEN 'I Don''t Know About That with Jim Jefferies'
    WHEN 14 THEN 'I Dont Know About That'
    WHEN 15 THEN 'I Dont Know About That-Radio'
    WHEN 16 THEN 'Invisible Choir'
    WHEN 17 THEN 'Jim Cornette Drive Thru & Experience'
    WHEN 18 THEN 'Jim Cornette Experience & Drive Thru'
    WHEN 19 THEN 'Jim Cornette''s Drive-Thru'
    WHEN 20 THEN 'King & the Sting'
    WHEN 21 THEN 'Lost in Panama'
    WHEN 22 THEN 'Media Circus with Kim Goldman'
    WHEN 23 THEN 'Metaphysical Milkshake'
    WHEN 24 THEN 'Mind Love'
    WHEN 25 THEN 'Myths and Legends'
    WHEN 26 THEN 'Nighty Night with Rabia Chaudry'
    WHEN 27 THEN 'Rabia and Ellyn Solve the Case'
    WHEN 28 THEN 'Revealing Your Secrets'
    WHEN 29 THEN 'Revealing Your Secrets with Alyx Weiss-Radio'
	WHEN 30	THEN 'Some More News-Radio'
	WHEN 31	THEN 'The Fighter and the Kid Podcast'
	WHEN 32	THEN 'The Fighter and The Kid-Radio'
	WHEN 33	THEN 'The Friendship Onion'
	WHEN 34	THEN 'The Jason Ellis Show'
	WHEN 35	THEN 'The Jason Ellis Show-Radio'
	WHEN 36	THEN 'The Mindset Mentor with Rob Dial'
	WHEN 37	THEN 'The Mindset Mentor-Radio'
	WHEN 38	THEN 'The Opportunist'
	WHEN 39	THEN 'The Schaub Show-Radio'
	WHEN 40	THEN 'The Viall Files'
	WHEN 41	THEN 'The Viall Files-Radio'
	WHEN 42	THEN 'Theo Von'
	WHEN 43	THEN 'This Past Weekend with Theo Von'
	WHEN 44	THEN 'This Past Weekend with Theo Von Podcast'
	WHEN 45	THEN 'This Past Weekend-Radio'
	WHEN 46	THEN 'TOTAL BY VERIZON(TBV)'
	WHEN 47	THEN 'TOTAL WIRELESS(TTW)'
	WHEN 48	THEN 'Twilight Effect Podcast'
	WHEN 49	THEN 'Unexplained'
	WHEN 50	THEN 'Vigilante'
	WHEN 51	THEN 'Was it Real The Hills Rewatch-Radio'
	WHEN 52	THEN 'Was it Real? The Hills Re-Watch'
	WHEN 53	THEN 'Welcome to the OC Bitches-Radio'
	WHEN 54	THEN 'Welcome to the OC, Bitches!'
	WHEN 55	THEN 'Welcome to the OC, Bitches! Podcast'
    ELSE entity_name
END
FROM updated_productions up
WHERE productions.id = up.id;

WITH updated_payers AS (
    SELECT id, row_number() over(order by id) as i
    FROM payers
    WHERE deleted_at IS NULL
    ORDER BY id
)
UPDATE payers
SET entity_name = CASE up.i
	WHEN 1 THEN 'BetterHelp'
	WHEN 2 THEN 'Incremental Media, Inc'
	WHEN 3 THEN 'Adopter Media'
	WHEN 4 THEN 'Ad Results Media'
	WHEN 5 THEN 'Strategic Media, Inc'
	WHEN 6 THEN 'Direct Results'
	WHEN 7 THEN 'PodSearch, Inc'
	WHEN 8 THEN 'Seed'
	WHEN 9 THEN 'MULLENLOWE MEDIAHUB NY'
	WHEN 10 THEN 'Podscale'
	WHEN 11 THEN 'VeritoneONE'
	ELSE entity_name
END,
contact_email = CASE up.i
	WHEN 1 THEN 'brittany.clevenger@betterhelp.com'
	WHEN 2 THEN 'accountspayable@incrementalmedia.com'
	WHEN 3 THEN 'glenn@adopter.media'
	WHEN 4 THEN 'erin.cagler@adresultsmedia.com'
	WHEN 5 THEN 'robin@strategicmediainc.com'
	WHEN 6 THEN 'nic@directresults.com'
	WHEN 7 THEN 'info@podsearch.com'
	WHEN 8 THEN 'ari@weareaok.com'
	WHEN 9 THEN 'invoices@mullenlowemediahub.com'
	WHEN 10 THEN 'natalie@podscalemedia.com'
	WHEN 11 THEN 'Invoicing@veritone.com'
	ELSE contact_email
END
FROM updated_payers up
WHERE payers.id = up.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Aquí puedes agregar la lógica para revertir la migración si es necesario
-- Por ejemplo, podrías restaurar los nombres originales si los tienes almacenados en algún lugar
SELECT 'down SQL query';
-- +goose StatementEnd
