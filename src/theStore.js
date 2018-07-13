import _ from 'lodash';
import { observable, decorate, computed, action, extendObservable, configure } from "mobx";
import { observer, inject } from "mobx-react";
import { fetchTheData, deleteTheFile } from './dataFetcher';

const parentsOf = (path) => {
  const arr = path.split('/');
  return _.times(arr.length-1, (i) => _.dropRight(arr, i).join('/'));
}

const isDeletable = (path, deletionList) => {
  const parentPaths = parentsOf(path);
  const deletionListPaths = deletionList.map(x => x.path);
  const deletedParent = _.find(parentPaths, (parentPath) => _.includes(deletionListPaths, parentPath))
  return deletedParent !== undefined
}

configure({ enforceActions: true });

class TheStore {
  @observable baseTarget = '/tmp';
  @observable selectedTarget = null;
  @observable fileData = [];
  @observable deletionList = [];

  @computed get currentTarget(){
    return this.selectedTarget ? this.selectedTarget : this.baseTarget;
  }

  @computed get theFileData() {
    const theData = this.fileData.slice();
    return _.map(theData, fileItem => ({...fileItem,
        markedForDeletion: isDeletable(fileItem.path, this.deletionList)
      })
    );
  }

  @computed get isOnTop() {
    return this.currentTarget === this.baseTarget;
  }

  @computed get anyUnreadDeletions() {
    return !(this.deletionList.find((x) => x.seen !== true ) === undefined)
  }

  @action
  fetchFileData(path) {
    this.selectedTarget = path;
    fetchTheData(path)
    .then(
      action((data) => { this.fileData = data.resultList })
    );
  }

  @action
  markForDeletion(path) {
    if (isDeletable(path, this.deletionList)) return;
    this.deletionList.push({ path: path });
  }

  @action
  reallyDelete(path) {
    deleteTheFile(path)
    .then(
      action(() => { this.removeFromDeletionList(path); })
    ).catch(() => {});
  }

  @action
  putBackFileMarkedForDeletion(path) {
    this.removeFromDeletionList(path);
  }

  @action
  markDeletionListAsSeen() {
    this.deletionList = this.deletionList.map((x) => { x.seen = true; return x } );
  }

  removeFromDeletionList(path) {
    const deletionList1 = this.deletionList.filter((x) => x.path !== path)
    this.deletionList = deletionList1;
  }
}

export default TheStore;
