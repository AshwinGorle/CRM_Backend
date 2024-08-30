export const getFilterOptions = (query)=>{
  const {territory, subIndustry, industry, enteredBy} =  query;
  console.log("territory : ", territory)
  console.log("industry : , ",industry)
  console.log("subIndustry ; ",subIndustry)
  let filterOptions = {};
  if(territory && territory != ""){
    filterOptions.territory = territory;
  }
  if(subIndustry && subIndustry != ""){
    filterOptions.subIndustry = subIndustry;
  }
  if(industry && industry != ""){
    filterOptions.industry = industry;
  }
  if(enteredBy && enteredBy != ""){
    filterOptions.enteredBy = enteredBy
  }

  return filterOptions;
}

export const getSortingOptions = (query)=>{
  const {name, entryDate} = query
  let sortingOptions = {}
  if(name){
    if(name == '1')
      sortingOptions.name = 1;
    if(name == '-1')
      sortingOptions.name = -1;
  }
  if(entryDate && entryDate != ''){
    if(entryDate == "1")
      sortingOptions.entryDate = 1;
    if(entryDate == "-1")
      sortingOptions.entryDate = -1;
  }
  return sortingOptions
}
