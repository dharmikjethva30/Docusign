const axios = require('axios');

const envelope = async(req, res) => {

const accessToken = req.user.accessToken;
const templateId = req.body.templateId;
const recipients = [
    {
        "name": req.body.recipient1Name,
        "email": req.body.recipient1Email,
        "roleName": "Signer 1"
    },
    {
        "name": req.body.recipient2Name,
        "email": req.body.recipient2Email,
        "roleName": "Signer 2"
    }
];

try {
    const response = await axios.post(`https://demo.docusign.net/restapi/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes`, {
        "templateId": templateId,
        "status": "sent",
        "templateRoles": recipients
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    res.send(response.data);
} catch (err) {
    res.status(500).send('Error creating and sending envelope');
}

}

module.exports = envelope; 