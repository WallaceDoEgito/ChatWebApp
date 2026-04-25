using Amazon.S3;
using Amazon.S3.Transfer;
using ChatApp.Interfaces;

namespace ChatApp.Services.FileUpload;

public class AwsS3Bucket(IAmazonS3 s3Client, IConfiguration config) : ICloudProviderStrategy
{

    public Task UploadFileAsync(IFormFile file, string key)
    {
        var bucketName = config.GetValue<string>("AWS:BucketName");

        var fileTransferUtil = new TransferUtility(s3Client);
        var fileStream = file.OpenReadStream();

        var request = new TransferUtilityUploadRequest
        {
            BucketName = bucketName,
            InputStream = fileStream,
            Key = key,
            ContentType = file.ContentType
        };

        return fileTransferUtil.UploadAsync(request);
    }

    public string GetUrlCdnByKeyAsync(string key)
    {
        var cloudfrontBaseUrl = config.GetValue<string>("AWS:CloudFrontDomain");
        return $"https://{cloudfrontBaseUrl}/{key}";
    }

    public string GetKeyForAvatarUpload(Guid userId)
    {
        return $"Avatar/${userId.ToString()}/{Guid.NewGuid()}";
    }
}