using ChatApp.Interfaces;

namespace ChatApp.Services;

public class BcryptPasswordHasher : IHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyHash(string hash, string passwordToVerify)
    {
        return BCrypt.Net.BCrypt.Verify(passwordToVerify, hash);
    }
}