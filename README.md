# ng-dyn-forms
Testing angular material dynamic forms, angular 17


## Form generator
- Angular dynamic forms
- Json file definition
- Editing mode - node.js service (ng-dyn-form-server) for storing json file into file system
- Responsive
- Validators and hints
- Angular material editors:
  - autocomplete (api filtered data source)
  - button-toggle
  - button-toggle-multiple
  - chips (api filtered data source)
  - checkbox
  - date
  - divider
  - multi-select
  - number
  - select
  - slide-toggle
  - space
  - text
  - textarea
  - slider

- Widths:
  - full
  - half
  - thirds
  - quarters
  - 1 up to 4 columns with automatic wrap


## Presentation mode
![alt text](images/f1.png)

## Editing mode
![alt text](images/f2.png)

## Sample usage
![alt text](images/code.png)
![alt text](images/codehtml.png)


## FormGroup result

```
{
  "company": "",
  "firstName": "",
  "lastName": "",
  "address": "",
  "state": {
    "key": 3,
    "label": "Arizona"
  },
  "color": {
    "key": 3,
    "label": "Aqua"
  },
  "postal_code": null,
  "shipping": null,
  "state_list": null,
  "check1": true,
  "car_name": "",
  "car_date1": "2024-05-14T22:00:00.000Z",
  "car_date2": null,
  "car_name2": "",
  "car_age2": 0,
  "sex": "W",
  "check2": true,
  "appearance": "I",
  "many_colors": [
    {
      "key": 2,
      "label": "AntiqueWhite"
    },
    {
      "key": 34,
      "label": "DarkSeaGreen"
    },
    {
      "key": 18,
      "label": "CornflowerBlue"
    }
  ],
  "pcolor": [
    "BL",
    "G",
    "B"
  ],
  "city": {
    "key": 100,
    "label": "Bratislava"
  },
  "slider": 40
}
```

Related with [ng-dyn-form-server](https://github.com/b-mi/ng-dyn-form-server)
