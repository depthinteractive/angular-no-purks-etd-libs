import {Pipe, PipeTransform} from '@angular/core';
import {Entry} from '../models/entry.model';

@Pipe({
  name: 'sortOrganizations'
})
export class SortOrganizationsPipe implements PipeTransform {
  public transform(organizations: Entry[], selectedOrganization: Entry): Entry[] {
    if (!organizations) {
      return [];
    }

    if (!selectedOrganization) {
      return organizations;
    }

    organizations = [...organizations];

    const selectedOrganizationIndex: number = organizations.findIndex(organization =>
      organization.key === selectedOrganization.key
    );

    if (selectedOrganizationIndex !== -1) {
      organizations.splice(selectedOrganizationIndex, 1);
      organizations.unshift(selectedOrganization);
    }

    return organizations;
  }
}
