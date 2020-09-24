const sonarqubeScanner = require("sonarqube-scanner");
sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    options: {
      "sonar.projectName": "MovieList",
      "sonar.sources": "src",
      "sonar.exclusions": "test/**",
      token: "0dc9f9399d2f2ddf9d074025a287d0d717b0e698",
    },
  },
  () => {}
);
