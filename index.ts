  
  import {map, flow, first, last, get, eq, isEmpty, find, reduce, split, replace, uniqWith, uniqBy, matches} from 'lodash';




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

  private localize2(errors, position) { 
    const localized = map(errors, (error) => {

      return {
        // TODO: getLocalizedSectionName
        sectionName: this.localizeSection(this.getSectionName()),
        fieldName: this.getFieldName()

      }

    console.log(error, 'error')
    })


  }

  private getSectionName(error: ValidationError): string {
    //return first(split(path, '.'));
    // return flow([
    //   (error) => get(error, 'path'),
    //   (path) => split(path, '.'),
    //   (splittedPath) => first(splittedPath)
    // ])(error);

    return first(this.getSplittedPath(error));
  }

  private getFieldName(error: ValidationError): string {
    // return flow([
    //   (error) => get(error, 'path'),
    //   (path) => split(path, '.'),
    //   (splittedPath) => first(splittedPath)
    // ])(error);

    return last(this.getSplittedPath(error));
  }

  private getSplittedPath(error): string[] {
    return split(get(error, 'path'), '.');
  }

  private localizeSection(sectionName: string): string {
    return this.propertyFilter(`html.multiplePositions.editor.validation.sections.${sectionName}`)
  }

  private localizeField(fieldName: string): string {
    return this.propertyFilter(`html.multiplePositions.editor.validation.fields.${fieldName}`)
  }
}


const service = new PositionErrorsAdapter();

console.log(service.localize2(validationResult, newPosition), 'service result')





//console.log(createMapOfParents(validationResult, newPosition), 'vr')