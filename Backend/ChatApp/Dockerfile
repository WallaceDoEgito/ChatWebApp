FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dev
WORKDIR /source

COPY ChatApp.csproj .
RUN dotnet restore

COPY . .

EXPOSE 8080

CMD ["dotnet", "run", "--urls=http://0.0.0.0:8080/"]

FROM dev AS publish
RUN dotnet publish "ChatApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS prod
WORKDIR /app

COPY --from=publish /app/publish .
COPY --from=publish /source/*.sh .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ChatApp.dll"]