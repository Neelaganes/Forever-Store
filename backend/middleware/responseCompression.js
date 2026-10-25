import { gzip } from 'node:zlib';

// Lightweight gzip middleware without adding another runtime dependency.
// It compresses JSON/text responses only when the client advertises gzip.
const responseCompression = (req, res, next) => {
    const originalSend = res.send.bind(res);
    const acceptsGzip = /(^|,\s*)gzip\s*(;|,|$)/i.test(req.headers['accept-encoding'] || '');

    if (!acceptsGzip) {
        return next();
    }

    res.send = (body) => {
        const contentType = res.getHeader('Content-Type') || '';
        const isCompressible = String(contentType).includes('application/json') || String(contentType).startsWith('text/');

        if (!isCompressible || body === undefined || body === null || Buffer.isBuffer(body)) {
            return originalSend(body);
        }

        const input = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
        gzip(input, (error, compressed) => {
            if (error) {
                return originalSend(body);
            }
            res.set('Content-Encoding', 'gzip');
            res.set('Vary', 'Accept-Encoding');
            res.set('Content-Length', compressed.length);
            return originalSend(compressed);
        });
    };

    next();
};

export default responseCompression;
