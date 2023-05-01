const axios = require('axios');

const getTemplate = async (req, res) => {

    const accessToken = req.user.accessToken;
    const templateId = req.params.templateId;

    try {
        const response = await axios.get(`https://demo.docusign.net/restapi/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/templates/${templateId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.send(response.data);
    } catch (err) {
        res.status(500).send('Error getting template details');
    }
}

module.exports = getTemplate;