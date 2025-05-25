namespace ChatApp.Interfaces;

public interface IHasher
{
    public String HashPassword(String password);
    public bool VerifyHash(String hash, String passwordToVerify);
}