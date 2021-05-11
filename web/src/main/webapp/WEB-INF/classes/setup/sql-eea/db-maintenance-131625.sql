UPDATE metadata SET data = replace(data,
                                   'Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged. The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information. The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website. Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu',
                                   'EEA standard re-use policy: unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged (http://www.eea.europa.eu/legal/copyright). Copyright holder: European Environment Agency (EEA).')
WHERE data LIKE '%Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged. The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information. The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website. Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu%';



UPDATE metadata SET data = replace(data,
                                   'Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged.  The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information.  The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website.  Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu',
                                   'EEA standard re-use policy: unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged (http://www.eea.europa.eu/legal/copyright). Copyright holder: European Environment Agency (EEA).')
WHERE data LIKE '%Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged.  The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information.  The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website.  Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu%';




UPDATE metadata SET data = replace(data,
                                   'Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged.  The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information. The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website.  Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu',
                                   'EEA standard re-use policy: unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged (http://www.eea.europa.eu/legal/copyright). Copyright holder: European Environment Agency (EEA).')
WHERE data LIKE '%Unless otherwise indicated, re-use of content on the EEA website for commercial or non-commercial purposes is permitted free of charge, provided that the source is acknowledged.  The EEA re-use policy follows Directive 2003/98/EC of the European Parliament and the Council on the re-use of public sector information throughout the European Union and Commission Decision 2006/291/EC, Euratom on the re-use of Commission information. The EEA accepts no responsibility or liability whatsoever for the re-use of content accessible on its website.  Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen, EEA, Kongens Nytorv 6, DK-1050 Copenhagen K, Tel +45 33 36 71 00, Fax +45 33 36 71 99, e-mail copyrights at eea.europa.eu%';


-- Cleaning up old tables
DROP TABLE params;
DROP TABLE requests;
DROP TABLE metadatastatus_202011_backup;


-- Check = 0
SELECT count(*) FROM metadata WHERE data LIKE '%Any inquiries about re-use of content on the EEA website should be addressed to Ove Caspersen%';

