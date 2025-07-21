FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY ChatApp.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
COPY --from=build /source/*.sh .
ENTRYPOINT [ "./entrypoint.sh" ]
