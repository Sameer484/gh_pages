const XML = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="urn:bbtest:idp:HDRCAP9b4e1d">
<md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
<md:KeyDescriptor use="signing"><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>MIIC/jCCAeagAwIBAgIUNUFRhz5tGW8MExqzF/N1i2cFxnMwDQYJKoZIhvcNAQELBQAwHzEdMBsGA1UEAwwUUEVORE9CQkZFVENIN2YzYTljMjEwHhcNMjYxMTExMTMzNTI3WhcNMjYxMjExMTMzNTI3WjAfMR0wGwYDVQQDDBRQRU5ET0JCRkVUQ0g3ZjNhOWMyMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMfT+Fp/11nuv51vCllf/5QmyrdKLJUgR4s2JIAzsKZkrnFkpu4cPH5IRbBBbAeHGLRPghztBXS/AJtbsVUG0Fpi6eHUkKaSFf3IyTb2Q1JmM2bsQVji2Q5OHA3t7Q8BLinr6jNBiLtxvAet4OAd7n0vfv5nVDSQBHyk8C2itxP37oZEXvV3HoZVvFtBI4BV1q7JxOW41tX66IALbHWVgq3b4UsL6omoPMDTTOveMvI+tv4lmmUSszeCB6IwY02ZRkV43+fQKK6+mJsmsiuN7uc6YU1qSOrm2V/wrixyD+nYvfmusBJffI7Jd+AbeyYW4Y8LrqrloVRJRfVPMlY6RPsCAwEAAaMyMDAwHQYDVR0OBBYEFMCg55Nz8wgKcyI5Swzeo61D86DXMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAEI7uFJnJTxAOGN2ue/ufm9MWHunAw7CZW98L7pF262mdBP5j1AweZDL9yIoJB46zMNUMVJxWUkRtF5xO7A10B+Y4lJWTxerlKhYy/B42OOn9TbsiX//0jIMOPHV9HtQxIMs8DlToYAjx/T7mYLs4dARGydd7S+b+ghY0aNnDLKGRFalNivqWjLmESrFgO01DS22jFV9K0ifDoCSPZUQEj6NYyO5feaWh50LAlTQ8+SCcknZOwyLs56Lo3nxAyhHrPcLlbyCUFxuhRXJJaj8422h146ZrWHjDMimmK/JSBBMRUdVPIQzbyp7CLlUA7iVGuEcAmB1/Crt6mjRmNV3QHA=</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor>
<md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://www.samirchapagain.com.np/sso/HDRCAP9b4e1d"/>
<md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://www.samirchapagain.com.np/sso/HDRCAP9b4e1d"/>
</md:IDPSSODescriptor>
</md:EntityDescriptor>`;

export default function handler(req, res) {
    console.log('INBOUND-CAPTURE ' + JSON.stringify({
          t: new Date().toISOString(),
          method: req.method,
          url: req.url,
          headers: req.headers
    }));
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(XML);
}
