namespace ChatApp.Services.FileUpload.Utils;
public class FileUtils
{
    private static string MagicBytesToExtension(byte[] bytes)
    {
        if (bytes.Length < 4)
            return ".unknown";

        return (bytes[0], bytes[1], bytes[2], bytes[3]) switch
        {
            (0x89, 0x50, 0x4E, 0x47) => ".png",
            
            (0xFF, 0xD8, 0xFF, _) => ".jpg",
            
            (0x47, 0x49, 0x46, 0x38) => ".gif",
            
            (0x42, 0x4D, _, _) => ".bmp",
            
            (0x25, 0x50, 0x44, 0x46) => ".pdf",
            
            (0x50, 0x4B, 0x03, 0x04) => ".zip",
            
            (0x52, 0x61, 0x72, 0x21) => ".rar",
            
            _ => string.Empty
        };
    }

    public static string GetFileExtension(IFormFile file)
    {
        if (file.Length < 4)
            return string.Empty;
        
        byte[] buffer = new byte[4];

        using (var stream = file.OpenReadStream())
        {
            stream.Read(buffer, 0, 4);
        }

        var extension = MagicBytesToExtension(buffer);
        if (string.IsNullOrEmpty(extension))
        {
            extension = Path.GetExtension(file.FileName);
        }  
        
        return extension;
    }

}