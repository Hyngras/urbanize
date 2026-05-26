// cucumber.js
module.exports = {
    default: {
      require: ["tests/bdd/steps/**/*.ts"], // Caminho para os steps
      format: ["progress", "json:tests/bdd/reports/cucumber-report.json"],
      paths: ["tests/bdd/features/**/*.feature"], // Caminho para os arquivos .feature
      publishQuiet: true,
    },
  };