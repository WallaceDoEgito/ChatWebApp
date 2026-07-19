using System.IO;
using ChatApp.Interfaces;
using ChatApp.Services.FileUpload.Utils;

namespace ChatApp.Services.FileUpload;

public class InMemory(IConfiguration config) : ICloudProviderStrategy
{

    public async Task UploadFileAsync(IFormFile file, string key)
    {
        var directory = Path.GetDirectoryName(key);
        
        Directory.CreateDirectory(directory);
        
        key += FileUtils.GetFileExtension(file);
        await using var stream = File.Create(key);
        await file.CopyToAsync(stream);
    }

    public string GetUrlCdnByKeyAsync(string key)
    {
        var directory = Path.GetDirectoryName(key) + '/';
        var keyFileName = key.Replace(directory, "");

        var filePath = Directory.GetFiles(directory, $"{keyFileName}.*").FirstOrDefault();
        
        var basePath = config.GetValue<string>("InMemorySave:BasePath");
        return filePath.Replace(basePath, "/cdn");
    }

    public string GetKeyForAvatarUpload(Guid userId)
    {
        var basePath = config.GetValue<string>("InMemorySave:BasePath");
        var folderToSave = config.GetValue<string>("InMemorySave:AvatarPath");

        if (string.IsNullOrEmpty(basePath) || string.IsNullOrEmpty(folderToSave))
        {
            throw new Exception("In memory save path is not configured!!!!");
        }
        
        var path = Path.Combine(basePath, folderToSave);
        return $"{path}/{userId.ToString()}/{Guid.NewGuid()}";
    }
}