require('dotenv').config();
const path = require('path'), zlib = require('zlib'), express = require('express'), nodemailer = require('nodemailer'), vhost = require('vhost');

const email = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD }
});

const mainweb = express(), rrme = express();
rrme.set('view engine', 'ejs');
rrme.set('views', path.join(__dirname, 'public', 'templates'));
mainweb.set('view engine', 'ejs');
mainweb.set('views', path.join(__dirname, 'public', 'templates')); 
mainweb.set('subdomain offset', 1);
mainweb.use(express.urlencoded({ extended: false }));
mainweb.use(express.json());
mainweb.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
const port = process.env.PORT;
mainweb.set('trust proxy', 1);

rrme.get('/', (req, res) => {
    try {
        res.render('landing', (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error loading Earthworks: " + err.message);
            }
            const acceptedEncodings = (req.headers['accept-encoding'] || '')
                .split(',')
                .map((entry) => entry.trim().toLowerCase());
            const acceptsGzip = acceptedEncodings.some((entry) => {
                const [encoding, ...parameters] = entry.split(';').map((part) => part.trim());
                const quality = parameters.find((parameter) => parameter.startsWith('q='));
                return (encoding === 'gzip' || encoding === '*') && (!quality || Number(quality.slice(2)) > 0);
            });
            res.vary('Accept-Encoding');

            if (!acceptsGzip) {
                return res.send(html);
            }
            zlib.gzip(html, (compressionError, compressedHtml) => {
                if (compressionError) {
                    console.error(compressionError);
                    return res.send(html);
                }
                res.set('Content-Encoding', 'gzip');
                res.type('html').send(compressedHtml);
            });
        });
    } catch (err) { 
        console.error(err);
        res.status(500).send("Error loading Earthworks: " + err.message); 
    } 
});

rrme.post('/contactform', async (req, res) => {
    try {
        const { usersname, formemail, phonenumber, message } = req.body;
        console.log(`Contact Form Submission:\nName: ${usersname}\nEmail: ${formemail}\nPhone: ${phonenumber}\nMessage: ${message}`);
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.RRMEMAIL,
            subject: 'Form Submission Received',
            html: `
                <p><strong>Name:</strong> ${usersname}</p>
                <p><strong>Email:</strong> <a href="mailto:${formemail}">${formemail}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${phonenumber}">${phonenumber}</a></p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };
        email.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
            res.redirect('/formsuccess');
        });
        const mailOptions2 = {
            from: process.env.EMAIL,
            to: process.env.DEVEMAIL,
            subject: 'Form Submission Received',
            html: `
                <p><strong>Name:</strong> ${usersname}</p>
                <p><strong>Email:</strong> <a href="mailto:${formemail}">${formemail}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${phonenumber}">${phonenumber}</a></p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };
        email.sendMail(mailOptions2, (error, info) => {
            if (error) console.log(error);
            else console.log('Email sent: ' + info.response);
            res.redirect('/formsuccess');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error submitting contact form." });
    }
});

rrme.get(`/formsuccess`, (req, res) => { 
    try { 
        res.render('formsuccess'); 
    } catch (err) { 
        console.error(err); 
        res.status(500).send("Error loading success page: " + err.message); 
    } 
});

rrme.get('/*any', (req, res) => { res.redirect('/'); });

mainweb.use(vhost(`rrmearthworks.com`, rrme));
mainweb.listen(port, () => { console.log(`RRMEarthworks running on PORT:${port}/`); });
