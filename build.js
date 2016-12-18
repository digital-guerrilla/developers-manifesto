/**
 * build.js
 */

/* Node modules */
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

/* Third-party modules */
const pug = require("pug");

/* Files */
const languageCodes = require('./languages.json');

const getLanguageInfo = code => languageCodes.reduce((result, language) => {
    if (code === language.code) {
        result = language;
    }

    return result;
});

const getLanguages = () => {
    return fs.readdirSync(path.join(__dirname, "tmp"))
        .filter(file => {
            return fs.statSync(path.join(__dirname, "tmp", file)).isDirectory();
        })
        .reduce((result, language) => {
            const info = getLanguageInfo(language);

            if (info) {
                info.default = info.default || false;
                info.manifesto = fs.readFileSync(path.join(__dirname, "tmp", language, "manifesto.md"), "utf8");

                result.push(info);
            }

            return result;
        }, []);
};

const languages = getLanguages();

languages.forEach(lang => {
    const root = path.join(__dirname, "dist");

    const compiled = pug.renderFile(path.join(__dirname, "src", "index.pug"), lang);

    const savePath = [
        path.join(root, lang.code)
    ];

    if (lang.default) {
        savePath.push(path.join(root));
    }

    savePath.forEach(dir => {
        mkdirp.sync(dir);

        fs.writeFileSync(path.join(dir, "index.html"), compiled, "utf8");
    });
});