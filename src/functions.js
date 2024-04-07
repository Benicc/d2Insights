


function createChart(ctx, inputLabels, inputData) {

    let House = {
      label: 'House',
      data: inputData[0],
      borderWidth: 1
    }

    let Popping = {
      label: 'Popping',
      data: inputData[1],
      borderWidth: 1
    }

    let Breaking = {
      label: 'Breaking',
      data: inputData[2],
      borderWidth: 1
    }

    let HipHop = {
      label: 'Hip Hop',
      data: inputData[3],
      borderWidth: 1
    }

    let Krump = {
      label: 'Krump',
      data: inputData[4],
      borderWidth: 1
    }

    let FreeStyle = {
      label: 'Freestyle Team',
      data: inputData[5],
      borderWidth: 1
    }


    let dataSets = [House, Popping, Breaking, HipHop, Krump, FreeStyle];



    new Chart(ctx, {
        type: 'line',
        data: {
          labels: inputLabels,
          datasets: dataSets
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Week'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Students'
              }
            }
          }
        }
      });
}

