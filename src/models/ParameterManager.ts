class ParameterManager {
  params = {
    parameters: [],
    parametersProgress: [],
    progressCount: 100,
  };

  constructor(parameters?: Array<number>) {
    if (parameters) {
      this.setParameters(parameters);
    }
  }

  setParameters(parameters: Array<number>) {
    this.params.parameters = parameters;
    this.params.parametersProgress = [];
    this.params.progressCount = 0;

    parameters.forEach(function () {
      this.params.parametersProgress.push(0);
    }, this);
  }

  progress() {
    if (this.params.progressCount < 100) {
      this.params.parameters.forEach(function (parameter, i) {
        if (this.params.parametersProgress[i] >= this.params.parameters[i]) {
          this.params.parametersProgress[i] = this.params.parameters[i];
        } else {
          this.params.parametersProgress[i] += 2;
        }
      }, this);

      this.params.progressCount++;
    }
  }
}

export default ParameterManager;
