# strapi-provider-upload-cos

## 参数

| 参数名     | 类型   | 是否必填 | 默认值                                    | 描述                                                                                               |
| ---------- | ------ | -------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SecretId   | string | T        | -                                         | 用户的 SecretId                                                                                    |
| SecretKey  | string | T        | -                                         | 用户的 SecretKey，建议只在前端调试时使用，避免暴露密钥                                             |
| Region     | string | T        | -                                         | 存储桶所在地域，枚举值请参见 [地域和访问域名](https://cloud.tencent.com/document/product/436/6224) |
| Bucket     | string | T        | -                                         | 存储桶的名称，命名规则为 BucketName-APPID，此处填写的存储桶名称必须为此格式                        |
| BasePath   | string | F        | /                                         | 默认上传的文件夹路径                                                                               |
| BaseOrigin | string | F        | http://{Bucket}.cos.{Region}.myqcloud.com | 可填入 CDN 根路径                                                                                  |

## 示例

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: "cos",
    providerOptions: {
      SecretId: env('COS_SECRET_ID'),
      SecretKey: env('COS_SECRET_KEY'),
      Region: env('COS_REGION'),
      Bucket: env('COS_BUCKET'),
      BasePath: '/project-dir',
      BaseOrigin: 'https://cdn.domain.com',
    }
  },
  // ...
});
```