const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it

function init(){
    d3.json(url).then(function(data) {
        console.log(data);
        let sampleNames = data.names;
        let selector = d3.select("#selDataset");
                
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
      });

    console.log("the function ran successfully")

    // create dropdown/select
    // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let dataset = dropdownMenu.property("value");

    // run functions to generate plots
    createScatter('940')
    createBar('940')
    createSummary('940')
    dataGauge('940')

}

// creating the function that runs whenever user engages with dropdown

function optionChanged(newID){
// creating the charts
    createScatter(newID)
    createBar(newID)
    createSummary(newID)
    dataGauge(newID)

}

function createScatter(id){
    // creating dynamic filtering for bubble plot
        let otu_ids = [];
        let sample_values = [];
        let otu_labels = [];
    
        d3.json(url).then(function(data) {
        for (let i = 0; i < data.samples.length; i++){
            if(id === data.samples[i].id){
                for(let j = 0; j < data.samples[i].sample_values.length; j++){
                    otu_ids.push(data.samples[i].otu_ids[j])
                    sample_values.push(data.samples[i].sample_values[j])
                    otu_labels.push(data.samples[i].otu_labels[j])
                }
            }
        }
        let bubbleGraph = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
          };
          
       
        Plotly.newPlot("bubble", bubbleGraph);
        //console.log(otu_ids, sample_values)
    });
    // console log function
    console.log(`This function generates scatter plot of ${id} `)
}
  
function createBar(id){
    let otu_ids = [];
    let sample_values = [];
    let otu_labels = [];

    d3.json(url).then(function(data) {
    for (let i = 0; i < data.samples.length; i++){
        if(id === data.samples[i].id){
            for(let j = 0; j < data.samples[i].sample_values.length; j++){
                otu_ids.push(data.samples[i].otu_ids[j])
                sample_values.push(data.samples[i].sample_values[j])
                otu_labels.push(data.samples[i].otu_labels[j])
            }
        }
    }
    console.log(otu_ids)
    let top_ten = sample_values.slice(0,9).reverse();
    let top_ten_ids = otu_ids.slice(0,9).map(i=>`OTU ${i}`).reverse();
    let top_labels = otu_labels.slice(0,9).reverse();
    let bardata = [{
        type: 'bar',
        x: top_ten,
        y: top_ten_ids,
        text:top_labels,
        orientation: 'h',
        marker: {
            color: 'C3A59F',
            width: 1
          }
      }];
    Plotly.newPlot("bar",bardata);
});
    // checking to see if function is running
    console.log(`This function generates bar chart of ${id} `)

}

function createSummary(id){
    // code that makes list, paragraph, text/linebreaks at id='sample-meta'
    d3.json(url).then(function(data) {
        let demoList = "";
        let summaryTable = document.getElementById("sample-metadata")
        idType = Number(id)
        for(let i = 0; i < data.metadata.length; i++){
            let demoData = data.metadata[i]
            if(idType === demoData.id){
                for(let [key, value] of Object.entries(demoData)){
                    demoList += key + " : " + value + "<br>"
                }
            }
        };
        summaryTable.innerHTML = demoList;
    });
    // checking to see if function is running
    console.log(`This function generates summary info of ${id} `)
}
function dataGauge(id){
    
    d3.json(url).then(function(data) {
        idType = Number(id)
        for(let i = 0; i < data.metadata.length; i++)
        {
            let washData = data.metadata.filter(idType === demoData.id).wfreq
        let gdata = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washData,
                title: { text: "Weekly Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] }, bar: { color: "grey" }, steps: [
                    { range: [0, 3], color: "yellow" },
                    { range: [3, 6], color: "orange" },
                    { range: [6, 9], color: "red" }
                  ], }
            }
        ];
            
        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot("gauge", gdata, layout);
        //console.log(washData)
        //Couldn't get gauge data to change with each id, skipping for now, might come back.
    };    
    });
    console.log(`This function generates the gauge for ${id} `)
    };

// function called, runs init instructions
// runs only on load and refresh of browser page
init()