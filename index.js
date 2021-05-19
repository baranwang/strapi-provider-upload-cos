const COS = require('cos-nodejs-sdk-v5');
const { resolve: pathResolve } = require('path');
const crypto = require('crypto');
const { URL } = require('url');
const { default: axios } = require('axios');

module.exports = {
  init(config) {
    const {
      SecretId,
      SecretKey,
      Region,
      Bucket,
      BasePath,
      BaseOrigin,
      imageAve,
    } = config;

    const cos = new COS({
      SecretId,
      SecretKey,
      Domain: `${Bucket}.cos.${Region}.myqcloud.com`,
    });

    const getKey = (file) =>
      pathResolve('/', BasePath, file.path || '', `${file.hash}${file.ext}`);

    return {
      upload: (file) =>
        new Promise((resolve, reject) => {
          file.hash = crypto
            .createHash('sha1')
            .update(file.buffer)
            .digest('hex');

          cos.putObject(
            {
              Region,
              Bucket,
              Key: getKey(file),
              Body: Buffer.from(file.buffer, 'binary'),
            },
            async (err, data) => {
              if (err) return reject(err);
              file.url = `https://${data.Location}`;
              if (imageAve) {
                const { data } = await axios.get(`${file.url}?imageAve`)
                file.provider_metadata = data
              }
              if (BaseOrigin) {
                file.url = new URL(new URL(file.url).pathname, BaseOrigin).href;
              }
              resolve();
            }
          );
        }),
      delete: (file) =>
        new Promise((resolve, reject) => {
          cos.deleteObject(
            {
              Region,
              Bucket,
              Key: getKey(file),
            },
            (err, data) => {
              if (err) return reject(err);
              resolve();
            }
          );
        }),
    };
  },
};
