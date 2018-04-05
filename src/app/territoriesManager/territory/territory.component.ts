import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { TerritoryService, createLeafNode, createStationNode } from '../../_services/territory.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import {Station, Region, District } from '../../_models';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'territory-territories',
  templateUrl: './territory.component.html',
})
export class TerittoryComponent {
  waitingToShow: NodeJS.Timer;
  displayEditForm = false;
  territories: TreeNode[];
  selectedNode: TreeNode;
  prevSelectedNode: TreeNode;

  makeContextMenu(node){
    let edit;
    let add;
    if (node.data.type === "country") {
      add = "область";
    } else if (node.data.type === 'region') {
      add = "район";
      edit = "область";
    } else if (node.data.type === 'district') {
      add = "дільницю";
      edit = "район";
    } else {
      edit = "дільницю"
    }
    this.items = [];
    if (edit) {
      this.items.push({
        label: `Редагувати ${edit}`,
        command: (event: Event) => this.editNode(),
      }); 
      this.items.push({
        label: `Видалити ${edit}`,
        command: (event: Event) => this.deleteNode(),
      }); 
    }
    if (add) {
      this.items.push({
        label: `Додати ${add}`,
        command: (event: Event) => this.createNode(),
      }); 
    }
  
  }

  // Remove in the future
  get diagnostic() { return this.selectedNode ? JSON.stringify(this.selectedNode.data) : ''; }

  public items: MenuItem[] = [
    {
      label: 'Редагувати',
      command: (event: Event) => this.editNode(),
    },
    {
      label: 'Додати',
      command: (event: Event) => this.createNode(),
    },
    {
      label: 'Видалити',
      command: (event: Event) => this.deleteNode(),
    }
  ];

  constructor(private territoryService: TerritoryService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.territories = [
      {
        label: 'Вся Україна',
        data: {
          type: 'country',
        },
        leaf: false,
        droppable: false,
        draggable: false,
        expanded: true,
      }
    ];
    this.loadNode(this.territories[0]);
  }

  onMouseEnter(node, cm, event) {
    cm.hide(event);
    this.selectedNode = node;
    this.waitingToShow = setTimeout(_ => {
      this.makeContextMenu(node);
      cm.show(event);
    }, 500);
  }

  onMouseLeave(node, cm, event) {
    clearInterval(this.waitingToShow);
  }

  onSubmit() {

    this.displayEditForm = false;

    const node = this.selectedNode;
    let Type;
    let service;
    if (node.data instanceof Region) {
      service = this.territoryService.region;
      Type = Region;
    } else if (node.data instanceof District) {
      service = this.territoryService.district;
      Type = District;
    } else if (node.data instanceof Station) {
      service = this.territoryService.station;
      Type = Station;
    } else { return; }

    if (node.data.id) {
      service.update(node.data).subscribe(data => {
        data = new Type(data);
        node.label = data.name
        this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно оновлено'});
      });
    } else {
      service.create(node.data).subscribe(data => {
        data = new Type(data);
        node.label = data.name;
        node.data.id = data.id;
        if (!this.prevSelectedNode.children) {
          this.prevSelectedNode.children = [];
        }
        this.prevSelectedNode.children.push(node);
        this.prevSelectedNode.expanded = true;
        this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно створено'});
      });
    }
  }

  createNode() {
    const node = this.selectedNode;
    this.prevSelectedNode = node;
    // todo: add check on instace or type
    if (!node || !node.data || node.data.type === 'station') { return; }
    if (node.data.type === 'country') {
      this.selectedNode = { data: new Region({}), leaf: false };
    } else if (node.data.type === 'region') {
      this.selectedNode = { data: new District({}), leaf: false };
      this.selectedNode.data.region = node.data.id;
    } else if (node.data.type === 'district') {
      this.selectedNode = { data: new Station({}), leaf: true };
      this.selectedNode.data.district = node.data.id;
    } else {
      return;
    }
    this.displayEditForm = true;
  }

  getService() {
    const node = this.selectedNode;
    let service;
    if (node.data instanceof Region) {
      service = this.territoryService.region;
    } else if (node.data instanceof District) {
      service = this.territoryService.district;
    } else if (node.data instanceof Station) {
      service = this.territoryService.station;
    } else { return; }
    return service;
  }

  deleteNode() {
    const node = this.selectedNode;
    const parent = node.parent;
    if (!node || !node.data) { return; }
    const service = this.getService();
    if (!service) { return; }
    service.delete(node.data).subscribe(_ => {
      const index = parent.children.indexOf(node, 0);
      if (index > -1) {
        parent.children.splice(index, 1);
      }
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Запис успішно видалено'});
    });
  }

  editNode() {
    const node = this.selectedNode;
    // todo: add check on instace or type
    if (!node || ! node.data || node.data.type === 'country') { return; }
    this.displayEditForm = true;
  }

  loadNode(node) {
    if (!node || !node.data) { return; }

    if (node.data.type === 'country') {
      this.territoryService.region.getAll()
        .subscribe(res => {
          const children  = (<Region[]>res)
            .map(item => createLeafNode(new Region(item)));
          node.children = children;
        });
    }

    if (node.data instanceof Region) {
      this.territoryService.district.getByRegion(node.data)
        .subscribe(res => {
          const children = (<District[]>res)
            .map(item => createLeafNode(new District(item)));
          node.children = children;
        });
    }

    if (node.data instanceof District) {
      this.territoryService.station.getByDistrict(node.data)
        .subscribe(res => {
          const children = (<Station[]>res)
            .map(item => createStationNode(new Station(item)));
          node.children = children;
        });
    }
  }

}
