  
  import {map, includes, flow, first, last, get, eq, isEmpty, find, reduce, split, replace, uniqWith, uniqBy, matches} from 'lodash';




const collection = [
  {id: 5, x: 1, y: 1},
  {id: 4, x: 1, y: 1},
  {id: 7, x: 1, y: 1},
  {id: 4, x: 2, y: 2}
]

console.log(uniqBy(collection, 'x'))



  
  const newPosition = {
  "name": "",
  "positionCustomData": [
    {
      "name": "Only Custom Data Field",
      "value": "fgfhf%"
    },
    {
      "name": "Seniority",
      "value": "wwwwwwwwwwwwwwwwwwwddddddddddddddwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    }
  ],
  "isExempt": false,
  "locations": [
    {
      "effectiveDate": "2020-04-17",
      "laborCategory": null,
      "primaryJob": null
    },
    {
      "effectiveDate": "1900-01-01",
      "laborCategory": "",
      "primaryJob": ""
    }
  ],
  "positionStatuses": [
    {
      "name": "Active",
      "effectiveDate": "2020-04-17"
    },
    {
      "name": "Inactive",
      "effectiveDate": null
    },
    {
      "name": null,
      "effectiveDate": "2020-04-24"
    }
  ],
  "hireDate": "2020-04-17"
}

  const validationResult = [
  {
    "path": "name",
    "strategy": "required",
    "invalid": true
  },
  {
    "path": "positionCustomData.0.value",
    "strategy": "reg_exp",
    "invalid": true
  },
  {
    "path": "positionCustomData.1.value",
    "strategy": "max_length",
    "invalid": true
  },
  {
    "path": "locations.0.primaryJob",
    "strategy": "required",
    "invalid": true
  },
    {
    "path": "locations.1.primaryJob",
    "strategy": "required",
    "invalid": true
  },
  {
    "path": "positionStatuses.1.effectiveDate",
    "strategy": "required",
    "invalid": true
  },
  {
    "path": "positionStatuses.2.name",
    "strategy": "required",
    "invalid": true
  }
]

/*

html.pe_section_prefix_name = 'Position Name'
html.pe_section_prefix_name = 'Position Name'
html.pe_section_prefix_name = 'Position Name'

*/


function createMapOfParents(validationResult, data) {

  const r = reduce(validationResult, (acc, current) => {

    const sectionName = first(split(current.path, '.'));
    const fieldName = last(split(current.path, '.'));



    const adjusted = {
      ...current,
      path: current.path,
      sectionName,
      fieldName: eq(sectionName, 'positionCustomData') ? getDynamicFieldName(current.path, data) : fieldName
    }


    return {
      ...acc,
      [sectionName]: isEmpty(acc[sectionName]) ? [adjusted] : [...acc[sectionName], adjusted]
    }

  }, {})

  return r;

}


function getDynamicFieldName(path, data) {

  const p = replace(path, 'value', 'name');
  console.log(p, 'p')

  return get(data, p)


}

type Error = {

}

class PositionErrorsAdapter {

  propertyFilter = (value) => value;

  // public normalize(position, errors): NormalizedErrors {

  // }

  public buildLocalizedError(errors, position) {
      // return flow([
      //   () => this.format(errors, position),
      //   (formatted) => {
      //    return this.localize()
      //   },
      //   (localized) => this.combineToSingleError()
      // ])();
  }

  public combineToLocalizedError(errors): Error {

    /*
    flow([
      () => this.format(),
      (formatted) => this.localize(),
      (localized) => this.combineToSingleError()
    ])

    flow2([
      () => this.localize(), // flat array via map
      (localized) => this.groupBySections(),
      (grouped) => this.combineToSingleErrorInterface()
    ])


    */

  }

  private format(errors, position) {

    const r = reduce(errors, (acc, error) => {

      //const pathSegments = split(error.path, '.');
      // TODO: Consider to rename to id
      const sectionName = this.getSectionName(error.path);
      const fieldName = this.getFieldName(error.path);

      const formattedError = {
        ...error,
        sectionName,
        // TODO: Move to constant
        fieldName: eq(sectionName, 'positionCustomData') ? getDynamicFieldName(error.path, position) : fieldName
      }

      return {
        ...acc,
        [sectionName]: isEmpty(acc[sectionName]) ? [formattedError] : uniqBy([...acc[sectionName], formattedError], 'fieldName')
      }

    }, {})

    return r;
  }

  private localize(formattedErrors) {

    console.log()
    const r = reduce(formattedErrors, (acc, current) => {

      return {
       // ...acc,
       // [sectionName]: isEmpty(acc[sectionName]) ? [formattedError] : uniqBy([...acc[sectionName], formattedError], 'fieldName')
      }

    }, {})
  }

  //private localizaCustomData

  private localize2(errors, position) { 
    const localized = map(errors, ({path, strategy}) => {

      return {
        // TODO: getLocalizedSectionName
        description: this.localizeStrategy(strategy),
        sectionName: this.localizeSection(path),
        fieldName: (
          includes(path, 'positionCustomData')
            ? this.getCustomDataFieldName(path, position)
            : this.localizeField(path)
        )
        //fieldName: eq(sectionName, 'positionCustomData')
         // ? this.getCustomDataFieldName(error, position) : this.localizeField(this.getFieldName(error))
//eq(sectionName, 'positionCustomData') ? getDynamicFieldName(error.path, position) : fieldName
      }

    //console.log(error, 'error')
    })
  }

  // private getSectionName(error: ValidationError): string {  
  //   return first(this.getSplittedPath(error));
  // }

  // private getFieldName(error: ValidationError, position: Position): string {
  //   //return includes(error.path, 'positionCustomData') ? this.getCustomDataFieldName()
  //   return last(this.getSplittedPath(error));
  // }

  // private getSplittedPath(error: ValidationError): string[] {
  //   return split(get(error, 'path'), '.');
  // }

  private getCustomDataFieldName(path: string, position: Position): string {
    return get(replace(path, 'value', 'name'), position);
  }

  private localizeStrategy(strategy: string): string {
    return this.propertyFilter(`html.multiplePositions.editor.validation.strategies.${strategy}`);
  }

  private localizeSection(path: string): string {
    return flow([
      () => split(path, '.'),
      (splittedPath) => first(splittedPath),
      (sectionName) => this.propertyFilter(`html.multiplePositions.editor.validation.sections.${sectionName}`)
    ])();
  }

  private localizeField(path: string): string {
    // TODO: Check dynamic bahaviour, whether it returns the key intself or not
    //return this.propertyFilter(`html.multiplePositions.editor.validation.fields.${fieldName}`);
    return flow([
      () => split(path, '.'),
      (splittedPath) => last(splittedPath),
      (fieldName) => this.propertyFilter(`html.multiplePositions.editor.validation.fields.${fieldName}`)
    ])()
  }

  // private localizeField(fieldName: string): string {
  //   // TODO: Check dynamic bahaviour, whether it returns the key intself or not
  //   //return this.propertyFilter(`html.multiplePositions.editor.validation.fields.${fieldName}`);
  //   return flow([
  //     () => this.getSplittedPath(),
  //     () => this.getFieldName(),
  //     (sectionName) => this.propertyFilter(`html.multiplePositions.editor.validation.sections.${sectionName}`)
  //   ])()
  // }

  // private localizeCustomDataField() {

  // }
}

function getDynamicFieldName(path, data) {

  const p = replace(path, 'value', 'name');
  console.log(p, 'p')

  return get(data, p)


}


const service = new PositionErrorsAdapter();

console.log(service.localize2(validationResult, newPosition), 'service result')





//console.log(createMapOfParents(validationResult, newPosition), 'vr')