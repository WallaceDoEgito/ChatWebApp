using ChatApp.Interfaces;
using ChatApp.Services;

namespace ChatAppTests;

public class HasherTest
{
    [Fact]
    public void BcryptPasswordHasher_HashesThePassword_returningAHash()
    {
        String passwordExemple = "12345678";
        IHasher hasher = new BcryptPasswordHasher();
        Assert.NotEqual(passwordExemple, hasher.HashPassword(passwordExemple));
    }
    [Fact]
    public void BcryptPasswordHasher_VerifysHash_AndReturnTrueWhenEqual()
    {
        String passwordExemple = "12345678";
        IHasher hasher = new BcryptPasswordHasher();
        String hashedPass = hasher.HashPassword(passwordExemple);
        Assert.True(hasher.VerifyHash(hashedPass, passwordExemple));
    }
}