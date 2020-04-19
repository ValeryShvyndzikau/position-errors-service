  
  import {map, join, includes, concat, flow, first, last, get, eq, isEmpty, find, reduce, split, replace, uniqWith, uniqBy, matches} from 'lodash';


console.log(concat([], 'abc'), 'test concat')


const collection = [
  {id: 5, x: 1, y: 1},
  {id: 4, x: 1, y: 1},
  {id: 7, x: 1, y: 1},
  {id: 4, x: 2, y: 2}
]

//console.log(uniqBy(collection, 'x'))



  
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
      "status": "Active",
      "effectiveDate": "2020-04-17"
    },
    {
      "status": "Inactive",
      "effectiveDate": null
    },
    {
      "status": null,
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
    "path": "positionStatuses.2.status",
    "strategy": "required",
    "invalid": true
  }
]

/*

html.pe_section_prefix_name = 'Position Name'
html.pe_section_prefix_name = 'Position Name'
html.pe_section_prefix_name = 'Position Name'

*/


type Error = {};

class PositionErrorsAdapter {

  propertyFilter = (value) => value;

  public transformToErrorInterface(errors, position): Error {
    return flow([
      () => this.localize(errors, position),
      (localizedErrors) => this.groupBySections(localizedErrors),
      (grouppedErrors) => ({code: '', text: this.buildToSingleMessage(grouppedErrors)})
    ])();
  }

  private localize(errors: Errors, position: Position): LocalizedError[] { 
    return map(errors, ({path, strategy}) => ({
      description: this.localizeStrategy(strategy),
      sectionName: this.localizeSection(path),
      fieldName: (
        includes(path, 'positionCustomData')
          ? this.getCustomDataFieldName(path, position)
          : this.localizeField(path)
      )
    }));
  }

  private groupBySections(localizedErrors: LocalizedError[]): GrouppedError[] {
    return reduce(localizedErrors, (acc, error) => ({
      ...acc,
      //[error.sectionName]: uniqBy(concat(get(acc, error.sectionName, []), error), 'fieldName')
      [error.sectionName]: flow([
        () => get(acc, error.sectionName, []),
        (errors) => concat(errors, error),
        (errors) => uniqBy(errors, 'fieldName')
      ])()
    }), {});
  }

  private buildToSingleMessage(grouppedErrors): string {
    return reduce(grouppedErrors, (message, errors, groupName) => (
      `${message}
        <div>
          <strong>${groupName}: </stong> 
          ${join(reduce(errors, (acc, {fieldName, description}) => ([...acc,`"${fieldName}" ${description}`]), []), ', ')}
        </div>`
    ), '');
  }

  private getCustomDataFieldName(path: string, position: Position): string {
    return get(position, replace(path, 'value', 'name'));
  }

  private localizeStrategy(strategy: string): string {
    //return this.propertyFilter(`html.multiplePositions.editor.validation.strategies.${strategy}`);
    return this.propertyFilter(`${strategy}`);
  }

  private localizeSection(path: string): string {
    return flow([
      () => split(path, '.'),
      (splittedPath) => first(splittedPath),
      //(sectionName) => this.propertyFilter(`html.multiplePositions.editor.validation.sections.${sectionName}`)
      (sectionName) => this.propertyFilter(`${sectionName}`)
    ])();
  }

  private localizeField(path: string): string {
    return flow([
      () => split(path, '.'),
      (splittedPath) => last(splittedPath),
      //(fieldName) => this.propertyFilter(`html.multiplePositions.editor.validation.fields.${fieldName}`)
      (fieldName) => this.propertyFilter(`${fieldName}`)
    ])();
  }
}


const pea = new PositionErrorsAdapter();

console.log(pea.transformToErrorInterface(validationResult, newPosition), 'service result')


//console.log(get(newPosition, 'positionCustomData.1.name'))


//console.log(createMapOfParents(validationResult, newPosition), 'vr')