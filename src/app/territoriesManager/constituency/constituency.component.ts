import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { TerritoryService, createLeafNode, createStationNode } from '../../_services/territory.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Constituency, Station } from '../../_models';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'territory-constituencies',
  templateUrl: './constituency.component.html',
})
export class ConstituencyComponent implements OnInit {
  

  showDialog = false;
  displayForm = false;
  constituencies: TreeNode[];
  selectedNode: TreeNode;
  prevSelectedNode: TreeNode;
  items: MenuItem[];

  constructor(private territoryService: TerritoryService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.constituencies = [
      {
        label: 'Всі округи',
        data: {
          type: 'country',
        },
        leaf: false,
        draggable: false,
        droppable: false,
        expanded: true,
      }
    ];
    this.loadNode(this.constituencies[0]);
  }

  onSubmit() {
    const node = this.selectedNode;
    let constituency = node.data;
    this.displayForm = false; 
    if (!constituency) { return }
    if (constituency.id) {
      this.territoryService.constituency.update(constituency)
        .subscribe(data => {
          node.label = (new Constituency(data)).pname;
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно оновлено'});
        });
    } else {
      this.territoryService.constituency.create(constituency)
        .subscribe(data => {
          let c = new Constituency(data);
          node.label = c.pname;
          node.data.id = c.id;
          node.leaf = false;
          node.draggable = false;
          node.droppable = false
          if (!this.prevSelectedNode.children) {
            this.prevSelectedNode.children = [];
          }
          this.prevSelectedNode.children.push(node);
          this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно створено'});
        });
    }
       
  }

  onNodeDrop(event) {
    let constituency = event.dropNode.data;
    let station = event.dragNode.data; 
    this.territoryService.constituency.addStation(constituency, station)
      .subscribe(_ => {
        this.messageService.add({severity:'success', summary:'Успіх', detail:'Дільницю додану до округу'});
      });
  }


  makeContextMenu(node){
    if (node.data.type === "country") {
      this.items = [
        {
          label: 'Додати округ',
          command: (event: Event) => this.createNode(),
        },
      ];
    } else if (node.data.type === 'constituency') {
      this.items = [
        {
          label: 'Редагувати округ',
          command: (event: Event) => this.editNode(),
        },
        
        {
          label: 'Видалити округ',
          command: (event: Event) => this.deleteNode(),
        }
        
      ];
    } else {
      this.items = [
        {
          label: 'Видалити дільницю зі списку',
          command: (event: Event) => this.deleteNode(),
        },
      ];
    }
    
  }
  deleteNode(): any {
    const node = this.selectedNode;
    const parent = node.parent;
    let observableObj;
    if (!node || !node.data || node.data.type === 'country') { return; }
    if (node.data.type === 'constituency') {
      observableObj = this.territoryService.constituency.delete(node.data)
    } else if (node.data.type === 'station') {
      if (!parent.data.id){
        observableObj = {};
        observableObj.subscribe = func => func();
      } else {
        observableObj = this.territoryService.constituency.deleteStation(parent.data, node.data);
      }
      // todo: remove station and constitiency relation, and keep station
      
    } else { return; }

    // updating tree nodes
    observableObj.subscribe(_ => {
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
    if (node.data.type === 'country') {
      this.selectedNode = { data: new Constituency({}), leaf: false };
      this.displayForm = true;
    } 
  }

  editNode() {
    const node = this.selectedNode;
    // todo: add check on instace or type
    if (!node || ! node.data || node.data.type === 'country' || node.data.type === 'station') { return; }
    this.displayForm = true;
  }

  loadNode(node) {
    if (!node || !node.data) { return; }
    if (node.data.type === 'country') {
      this.territoryService.constituency.getAll()
        .subscribe(res => {
          const children  = (<Constituency[]>res)
            .map(item => { 
              let c = new Constituency(item)
              let node = createLeafNode(c);
              node.label = c.pname;
              return node;
            }
          );
          node.children = children;
        });
    }

    if (node.data.type === 'constituency') {
      this.territoryService.station.getByConstituency(node.data)
        .subscribe(res => {
          const children  = (<Station[]>res)
            .map(item => createStationNode(new Station(item)));
          node.children = children;
        });
    }
  }

}
