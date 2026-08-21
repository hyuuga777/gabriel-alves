const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/env\("DATABASE_URL"\)/, '"file:./test.db"');
schema = schema.replace(/Role/g, 'String');
schema = schema.replace(/StatusAssinatura/g, 'String');
schema = schema.replace(/enum String \{[^}]+\}/g, '');
schema = schema.replace(/@default\(ALUNO\)/g, '@default("ALUNO")');
schema = schema.replace(/@default\(ATIVA\)/g, '@default("ATIVA")');
// Any remaining enum usages
schema = schema.replace(/@db\.\w+/g, '');
fs.writeFileSync('prisma/schema.test.prisma', schema);
