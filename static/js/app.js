function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var ids = data.names

        id = ids.forEach(function(name) {
            selector
                .append("option")
                .text(name)
                .property("value");
        });

        buildMetadata(ids[0]);
        buildchart(ids[0]);
    });
};

function buildMetadata(sampleID) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var result = metadata.filter(m => m.id.toString() === sampleID)[0];
        
        var demoBox = d3.select("#sample-metadata");
        
        demoBox.html("");
        Object.entries(result).forEach((key) => {
            demoBox.append("h5").text(key[0]+" : " + key[1]);
        });
    });
};

function optionChanged(sampleID){
    buildMetadata(sampleID);
    buildchart(sampleID);
}

function buildchart(sampleID){

    d3.json("samples.json").then((data) => {

        var sampleDataset = data.samples;
        var sampleData = sampleDataset.filter(m => m.id.toString() === sampleID);
        var result = sampleData[0];

        var otu_top = result.otu_ids.slice(0,10).reverse();
        var otu_ids = otu_top.map(d => "OTU " + d);

        var sample_top = result.sample_values.slice(0,10).reverse();
        var otu_labels = result.otu_labels.slice(0,10);

//Horizontal bar chart
        var trace1 = {
            x: sample_top,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };

        var data1 = [trace1];

        var layout1 = {
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bar", data1, layout1);

//Bubble chart
        var trace2 = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: "markers",
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
            },
            text: result.otu_labels
        };

        var data2 = [trace2];

        var layout2 = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1000
        };

        Plotly.newPlot("bubble", data2, layout2);
    });
};

init();

