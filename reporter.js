let reporter = require('cucumber-html-reporter');

//TODO: NOT being used yet, to use it uncomment last line of this file and add a script in package.json to generate the report after running the tests, for example: "report": "node reporter.js"

let options = {
        theme: 'bootstrap',
        jsonFile: 'reports/cucumber_report.json',
        output: 'reports/cucumber_report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: true,
        brandTitle: 'Playwright -Test Automation Report',
        metadata: {
            "App Version":"0.0.1",
            "Test Environment": "STAGING",
            "Browser": "Chrome  54.0.2840.98",
            "Platform": "MacOs",
            "Parallel": "Scenarios",
            "Executed": "Remote"
        }
    };

  /*   reporter.generate(options); */