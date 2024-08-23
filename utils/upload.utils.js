
export const streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
};


export const  parseRevenueData =( bulkData)=> {
    let yearQuarterPositions = [];
    const firstRow = bulkData[0]; // First row contains the headers

    // Identify the positions of years and quarters in the first row
    Object.entries(firstRow).forEach(([key, value], index) => {
        let match = key.match(/REVENUE IN (\d{4})/);
        if (match) {
            let year = parseInt(match[1], 10);
            yearQuarterPositions.push({
                year: year,
                Q1: index, // Assume the next few fields are Q1, Q2, Q3, Q4
                Q2: index + 1,
                Q3: index + 2,
                Q4: index + 3
            });
        }
    });

    // Parse the revenue data for each row
    return bulkData.slice(1).map(row => {
        let revenueData = [];

        yearQuarterPositions.forEach(({ year, Q1, Q2, Q3, Q4 }) => {
            let revenueEntry = {
                year: year,
                Q1: parseFloat(row[Object.keys(firstRow)[Q1]]) || 0,
                Q2: parseFloat(row[Object.keys(firstRow)[Q2]]) || 0,
                Q3: parseFloat(row[Object.keys(firstRow)[Q3]]) || 0,
                Q4: parseFloat(row[Object.keys(firstRow)[Q4]]) || 0
            };
            revenueData.push(revenueEntry);
        });

        return revenueData;
    });
  }