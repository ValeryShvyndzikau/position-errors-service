  
  import {first, last, get, eq, isEmpty, find, reduce, split, replace} from 'lodash';

  
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

class PositionErrorsService {

  propertyFilter = (value) => value;

  // public normalize(position, errors): NormalizedErrors {

  // }

  public combineToLocalizedError(errors): Error {

    /*
    flow([
      () => this.formatAndLocalize(),
      (formattedErrors) => this.combineToSingleError()
    ])


    */

  }

  private formatAndLocalize(errors, position) {

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
        [sectionName]: isEmpty(acc[sectionName]) ? [formattedError] : [...acc[sectionName], formattedError]
      }

  }, {})

  return r;
  }

  private getSectionName(path: string[]): string {
    return first(split(path, '.'));
  }

  private getFieldName(path: string[]): string {
    return last(split(path, '.'));
  }

  private localizeSection(sectionName: string): string {
    return this.propertyFilter(`html.multiplePositions.editor.validation.sections.${sectionName}`)
  }

  private localizeField(fieldName: string): string {

    return this.propertyFilter(`html.multiplePositions.editor.validation.sections.${fieldName}`)

  }



}



console.log(createMapOfParents(validationResult, newPosition), 'vr')