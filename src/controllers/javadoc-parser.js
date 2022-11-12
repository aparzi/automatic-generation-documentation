const axios = require("axios");
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({attrkey: "ATTR"});
const javadocParser = async (req, res) => {
    try {

        let total = {
            founded: [],
            not_found: [],
            percentage_founded: 0
        };
        const response = await axios.get('https://api.github.com/search/repositories?q=language:java&page=1&per_page=50&sort=stars');
        const {items} = response?.data;
        for (const item of items) {
            const url = `${item?.html_url}/blob/${item?.default_branch}/pom.xml`;
            const result = await checkPomContainsReference(`${item?.html_url}/blob/${item?.default_branch}/pom.xml`);
            if (result) {
                total.founded.push(url);
            } else {
                total.not_found.push(url);
            }
        }

        total.percentage_founded = (total.founded.length * 100) / (total.not_found.length + total.founded.length);

        console.log('total reference => ', total);

        res.status(200).json({total: total});

    } catch (error) {
        await console.error('Error parser xml file =>', error);
        return res.status(error?.status || 500).json();
    }
};

const checkPomContainsReference = async (file_url) => {
    return new Promise((resolve, reject) => {
        https.get(file_url, function (res) {
            let data = '';
            res.on('data', function (stream) {
                data += stream;
            });
            res.on('end', function () {
                if (data !== '') {
                    parser.parseString(data, function (error, result) {
                        resolve(data?.toString()?.includes('maven-javadoc-plugin'));
                    });
                } else {
                    resolve(false);
                }
            });
        });
    });
}

module.exports = javadocParser;