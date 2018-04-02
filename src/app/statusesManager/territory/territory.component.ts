import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { TerritoryService, createLeafNode, createStationNode } from '../../_services/territory.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import {Station, Region, District, Status } from '../../_models';
import { StatusService } from '../../_services/status.service';
import { SelectItem } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'status-territories',
  templateUrl: './territory.component.html',
})
export class TerritoryComponent {
  territories: TreeNode[];
  selectedNode: TreeNode;
  items: MenuItem[];
  nodeDropped = new EventEmitter()

  constructor(private territoryService: TerritoryService, 
              private statusServcie: StatusService,
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
  

  makeContextMenu(node) {
    console.log(node);
    if (node.data.type === "country" || node.data.type === "static") {
      this.items = [];
    } else if (node.data.type === "region") {
      this.items = [
        {
          label: 'Видалити всі статуси з області',
          command: (event: Event) => this.deleteAllStatuses(this.territoryService.region, node),
        }
      ]
    } else if (node.data.type === "district") {
      this.items = [
        {
          label: 'Видалити всі статуси з району',
          command: (event: Event) => this.deleteAllStatuses(this.territoryService.district, node),
        }
      ]
    } else if (node.data.type === "station") {
      this.items = [
        {
          label: 'Видалити всі статуси з дільниці',
          command: (event: Event) => this.deleteAllStatuses(this.territoryService.station, node),
        }
      ]
    } else if (node.parent.data.type === "static" ) {
      this.items = [
        {
          label: 'Видалити зі статичних статусів',
          command: (event: Event) => this.deleteFromStatic(node)
        }
      ]
    } else {
      this.items = [
        {
          label: 'Видалити статус з дільниці',
          command: (event: Event) => this.deleteStatus(node),
        }
      ]
    }
  }

  deleteFromStatic(node){
    node.parent.expanded = false;
    node.data.is_static = false;
    const status = new Status(node.data);
    this.statusServcie.update(status).subscribe(_ => {
      this.nodeDropped.emit();
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Статуc видалено'});
    })
  }

  deleteStatus(node) {
    // todo: collapse after deletions
    node.parent.expanded = false;
    const station = node.parent.data
    this.territoryService.station.deleteStatus(station, node.data).subscribe(_ => {
      this.nodeDropped.emit();
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Статус видалено'});
    });
  }

  deleteAllStatuses(service, node) {
    node.parent.expanded = false;
    //todo: collapse after deletions
    service.deleteAllStatuses(node.data).subscribe(_ => {
      this.nodeDropped.emit();
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Статуси видалено'});
    });
  }

  onNodeDrop(event) {
    const dropNode = event.dropNode;
    const dragNode = event.dragNode;
    let service;
    if (dropNode.data.type === 'region') {
      service = this.territoryService.region
    } else if (dropNode.data.type === 'district') {
      service = this.territoryService.district
    } else if (dropNode.data.type === 'station') {
      service = this.territoryService.station
    } else if (dropNode.data.type === 'static') {
      dragNode.data.isStatic = true;
      return this.statusServcie.update(dragNode.data).subscribe(_ => {
        this.nodeDropped.emit();
        this.messageService.add({severity:'success', summary:'Успіх', detail:'Статус успішно оновлено'});
      });
    } else return;
    service.addStatus(dropNode.data, dragNode.data).subscribe(_=> {
      this.nodeDropped.emit();
      this.messageService.add({severity:'success', summary:'Успіх', detail:'Статус успішно додано'});
    });
  }
  

  loadNode(node) {
    
    if (!node || !node.data) { return; }

    if (node.data.type === 'country') {
      return this.territoryService.region.getAll()
        .subscribe(res => {
          const children  = (<Region[]>res)
            .map(item => createLeafNode(new Region(item)));
          const staticStatuses = {
            label: '** Статичні статуси',
            data: {
              type: 'static',
            },
            leaf: false,
            droppable: true,
            draggable: false,
          }
          children.unshift(staticStatuses);
          node.children = children;
        });
    }

    if (node.data instanceof Region) {
      return this.territoryService.district.getByRegion(node.data)
        .subscribe(res => {
          const children = (<District[]>res)
            .map(item => createLeafNode(new District(item)));
          node.children = children;
        });
    }

    if (node.data instanceof District) {
      return this.territoryService.station.getByDistrict(node.data)
        .subscribe(res => {
          const children = (<Station[]>res)
            .map(item => {
              const station = new Station(item);
              return {
                label: station.number,
                data: station,
                draggable: false,
                droppable: false,
                leaf: false
              };
            });
          node.children = children;
        });
    }
    
    if (node.data instanceof Station) {
      this.territoryService.station.getStatuses(node.data)
        .subscribe(res => {
          const children = (<Status[]>res)
            .map(item => {
              const status = new Status(item);
              return {
                label: status.name,
                data: status,
                draggable: false,
                droppable: false,
                leaf: true 
              } 
            });
          node.children = children;
        });
    }

    if (node.data.type === 'static') {
      this.statusServcie.getStatic()
        .subscribe((statuses: Status[]) => {
          node.children = statuses.map((status: Status) => <TreeNode>{
            label: status.name,
                data: status,
                draggable: false,
                droppable: false,
                leaf: true 
          } );
        });
    }

   
  }

}
