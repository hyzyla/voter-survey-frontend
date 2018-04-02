import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { TerritoryService, createLeafNode, createStationNode } from '../../_services/territory.service';
import { StatusService } from '../../_services/status.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Constituency, Station, Status, Option } from '../../_models';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'status-statuses',
  templateUrl: './status.component.html',
})
export class StatusComponent implements OnInit {
  

  showDialog = false;
  displayForm = false;
  statuses: TreeNode[];
  selectedNode: TreeNode;
  prevSelectedNode: TreeNode;

  public items: MenuItem[];

  public statusTypes: SelectItem[] = [
    {label: "Число", value: 1},
    {label: "Рядок", value: 2},
  ];

  constructor(
    private territoryService: TerritoryService, 
    private statusService: StatusService, 
    private messageService: MessageService) { }

  ngOnInit() {
    this.statuses = [
      {
        label: 'Всі статуси',
        data: {
          type: 'country',
        },
        leaf: false,
        draggable: false,
        droppable: false,
        expanded: true,
      }
    ];
    this.loadNode(this.statuses[0]);
  }

  onSubmit() {
    
    const node = this.selectedNode;
    let status = node.data;
    this.displayForm = false; 
    if (!status) { return }
    if (status.id) {
      this.statusService.update(status)
        .subscribe(data => {
          node.label = (new Status(data)).name;
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно оновлено'});
        });
    } else {
      this.statusService.create(status)
        .subscribe(data => {
          let c = new Status(data);
          node.label = c.name;
          node.data.id = c.id;
          if   (!this.prevSelectedNode.children) {
            this.prevSelectedNode.children = [];
          }
          this.prevSelectedNode.children.push(node);
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно створено'});
        });
    }
       
  }


  makeContextMenu(node){
    if (node.data.type === "country") {
      this.items = [
        {
          label: 'Додати статус',
          command: (event: Event) => this.createNode(),
        },
      ];
    } else if (node.data.type === 'status') {
      this.items = [
        {
          label: 'Редагувати статус',
          command: (event: Event) => this.editNode(),
        },
        
        {
          label: 'Видалити статус',
          command: (event: Event) => this.deleteNode(),
        }
        
      ];
    }
  }


  deleteAllOptions(event) {
    this.selectedNode.data.options = [];
  }

  deleteOption(option) {
      const options = this.selectedNode.data.options;
      var index = options.indexOf(option, 0);
      if (index > -1) {
        options.splice(index, 1);
      }
  }

  deleteNode(): any {
    const node = this.selectedNode;
    const parent = node.parent;
    let observableObj;
    if (!node || !node.data || node.data.type !== 'status') { return; }
    this.statusService.delete(node.data)
      .subscribe(_ => {
      const index = parent.children.indexOf(node, 0);
   
      if (index > -1) {
        parent.children.splice(index, 1);
      }
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно видалено'});
    });
  }

  createNode(): any {
    const node = this.selectedNode;
    this.prevSelectedNode = node;
    if (!node || !node.data || node.data.type !== 'country') { return; }
   
    this.selectedNode = { 
      data: new Status({}), 
      leaf: true,
      draggable: true,
      droppable: false,
    };
    this.displayForm = true;
    
  }

  addNewOption(event) {
    const status = this.selectedNode.data;
    status.options.push(new Option({value:"Новий варіант"}))
  }

  editNode() {
    const node = this.selectedNode;
    // todo: add check on instace or type
    if (!node || ! node.data || node.data.type !== 'status') { return; }
    this.displayForm = true;
  }

  loadNode(node) {
    if (!node || !node.data) { return; }

    if (node.data.type === 'country') {
      this.statusService.getAll()
        .subscribe(res => {
          const children  = (<Status[]>res).map(item => {
            let status = new Status(item);
            return {
              label: status.name,
              leaf: true,
              data: status,
              dropable: false,
              draggable: true,
            }
          });
          node.children = children;
        });
    }

   
  }

}
