# cydc
Next version of cydc

# Environments:
| ID         | Branch       | Database   | Url                            |
|------------|--------------|------------|--------------------------------|
| Local      | master       | Test       | https://localhost:44301        |
| Test       | release/dev  | Test       | https://cydc2-dev.starworks.cc |
| Production | release/prod | Production | https://cydc2.starworks.cc     |

# Technical Frameworks:
* Server Framework: [ASP.NET Core 2.2](https://github.com/aspnet/AspNetCore)/[EF Core 2.2](https://github.com/aspnet/EntityFrameworkCore)
* Frontend Framework: [Angular](https://github.com/angular/angular)
* Login Management: [YeluCasSSO](https://github.com/sdcb/YeluCasSsoClient) & [ASP.NET Identity](https://github.com/aspnet/AspNetCore/tree/master/src/Identity)
* UI: [Angular Material 2](https://github.com/angular/material2) and [Bootstrap 4](https://github.com/twbs/bootstrap)

# Build Notes:
* Fork this repository
* Ensure config from your usersecrets.json(YeluCasSsoEndpoint/CydcConnection)
* run: `msbuild cydc.sln`

# Contribute Notes:
* Fork this repository
* Create your feature branch based on origin/master
* Submit a Pull Request/Merge Request
