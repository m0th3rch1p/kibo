'use client';

import { faker } from '@faker-js/faker';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from '@repo/calendar';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  getDependentFeatures,
  getBlockingFeatures,
  validateDependencies,
  getDependencySummary,
} from '@repo/gantt';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@repo/kanban';
import {
  type DragEndEvent,
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@repo/list';
import type { ColumnDef } from '@repo/table';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from '@repo/table';
import groupBy from 'lodash.groupby';
import {
  CalendarIcon,
  ChevronRightIcon,
  EyeIcon,
  GanttChartSquareIcon,
  KanbanSquareIcon,
  LinkIcon,
  ListIcon,
  TableIcon,
  TrashIcon,
  GitBranchIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const statuses = [
  { id: faker.string.uuid(), name: 'Planned', color: '#6B7280' },
  { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
  { id: faker.string.uuid(), name: 'Done', color: '#10B981' },
];

const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

const exampleGroups = Array.from({ length: 6 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));

const exampleProducts = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));

const exampleInitiatives = Array.from({ length: 2 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));

const exampleReleases = Array.from({ length: 3 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
  }));

const exampleFeatures = (() => {
  // Create specific features with realistic dependencies for a software project
  const baseFeatures = [
    {
      id: 'user-auth',
      name: 'User Authentication System',
      startAt: new Date(2024, 0, 1),
      endAt: new Date(2024, 0, 15),
      status: statuses[2], // Complete
      owner: users[0],
      group: exampleGroups[0],
      product: exampleProducts[0],
      initiative: exampleInitiatives[0],
      release: exampleReleases[0],
    },
    {
      id: 'user-profiles',
      name: 'User Profile Management',
      startAt: new Date(2024, 0, 16),
      endAt: new Date(2024, 1, 5),
      status: statuses[1], // In Progress
      owner: users[1],
      group: exampleGroups[0],
      product: exampleProducts[0],
      initiative: exampleInitiatives[0],
      release: exampleReleases[0],
      dependencies: ['user-auth'], // Depends on authentication
    },
    {
      id: 'dashboard',
      name: 'User Dashboard',
      startAt: new Date(2024, 1, 6),
      endAt: new Date(2024, 1, 28),
      status: statuses[0], // Planned
      owner: users[2],
      group: exampleGroups[0],
      product: exampleProducts[0],
      initiative: exampleInitiatives[0],
      release: exampleReleases[0],
      dependencies: ['user-auth', 'user-profiles'], // Depends on both auth and profiles
    },
    {
      id: 'api-endpoints',
      name: 'REST API Development',
      startAt: new Date(2024, 0, 8),
      endAt: new Date(2024, 1, 20),
      status: statuses[1], // In Progress
      owner: users[3],
      group: exampleGroups[1],
      product: exampleProducts[0],
      initiative: exampleInitiatives[0],
      release: exampleReleases[0],
      dependencies: ['user-auth'], // API needs auth
    },
    {
      id: 'mobile-app',
      name: 'Mobile Application',
      startAt: new Date(2024, 1, 21),
      endAt: new Date(2024, 3, 15),
      status: statuses[0], // Planned
      owner: users[4],
      group: exampleGroups[1],
      product: exampleProducts[1],
      initiative: exampleInitiatives[1],
      release: exampleReleases[1],
      dependencies: ['api-endpoints'], // Mobile app needs API
    },
    {
      id: 'notifications',
      name: 'Push Notifications',
      startAt: new Date(2024, 2, 1),
      endAt: new Date(2024, 2, 20),
      status: statuses[0], // Planned
      owner: users[0],
      group: exampleGroups[0],
      product: exampleProducts[0],
      initiative: exampleInitiatives[0],
      release: exampleReleases[0],
      dependencies: ['user-profiles'], // Notifications need user profiles
    },
  ];

  // Add some additional random features to fill out the timeline
  const additionalFeatures = Array.from({ length: 14 })
    .fill(null)
    .map(() => {
      const feature = {
        id: faker.string.uuid(),
        name: capitalize(faker.company.buzzPhrase()),
        startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
        endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
        status: faker.helpers.arrayElement(statuses),
        owner: faker.helpers.arrayElement(users),
        group: faker.helpers.arrayElement(exampleGroups),
        product: faker.helpers.arrayElement(exampleProducts),
        initiative: faker.helpers.arrayElement(exampleInitiatives),
        release: faker.helpers.arrayElement(exampleReleases),
        dependencies: undefined as string[] | undefined,
      };

      // Some random features might also have dependencies
      if (Math.random() < 0.2) {
        const possibleDeps = baseFeatures.slice(0, 3); // Can depend on main features
        feature.dependencies = [faker.helpers.arrayElement(possibleDeps).id];
      }

      return feature;
    });

  return [...baseFeatures, ...additionalFeatures];
})();

const exampleMarkers = Array.from({ length: 6 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    date: faker.date.past({ years: 0.5, refDate: new Date() }),
    label: capitalize(faker.company.buzzPhrase()),
    className: faker.helpers.arrayElement([
      'bg-blue-100 text-blue-900',
      'bg-green-100 text-green-900',
      'bg-purple-100 text-purple-900',
      'bg-red-100 text-red-900',
      'bg-orange-100 text-orange-900',
      'bg-teal-100 text-teal-900',
    ]),
  }));

const GanttView = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  const groupedFeatures = groupBy(features, 'group.name');

  const sortedGroupedFeatures = Object.fromEntries(
    Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
      nameA.localeCompare(nameB)
    )
  );

  const handleViewFeature = (id: string) =>
    console.log(`Feature selected: ${id}`);

  const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);

  const handleRemoveFeature = (id: string) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));

  const handleRemoveMarker = (id: string) =>
    console.log(`Remove marker: ${id}`);

  const handleCreateMarker = (date: Date) =>
    console.log(`Create marker: ${date.toISOString()}`);

  const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
    if (!endAt) {
      return;
    }

    setFeatures((prev) => {
      const updatedFeatures = prev.map((feature) =>
        feature.id === id ? { ...feature, startAt, endAt } : feature
      );
      
      // Validate dependencies after the move
      const movedFeature = updatedFeatures.find(f => f.id === id);
      if (movedFeature) {
        const validation = validateDependencies(movedFeature, updatedFeatures);
        if (!validation.isValid) {
          console.warn(`⚠️ Moving "${movedFeature.name}" created dependency conflicts:`);
          validation.conflicts.forEach(conflict => {
            console.warn(`  • ${conflict}`);
          });
        }
      }
      
      return updatedFeatures;
    });

    console.log(`📅 Moved feature: ${id} from ${startAt.toLocaleDateString()} to ${endAt.toLocaleDateString()}`);
  };

  const handleAddFeature = (date: Date) =>
    console.log(`Add feature: ${date.toISOString()}`);

  const handleViewDependencies = (id: string) => {
    const feature = features.find(f => f.id === id);
    if (!feature) return;
    
    const dependencies = getDependentFeatures(feature, features);
    const blocking = getBlockingFeatures(feature, features);
    const validation = validateDependencies(feature, features);
    
    console.group(`🔗 Dependencies for "${feature.name}"`);
    
    if (dependencies.length > 0) {
      console.log(`📋 Depends on (${dependencies.length}):`);
      dependencies.forEach(dep => {
        console.log(`  • ${dep.name} (${dep.status.name})`);
      });
    } else {
      console.log('📋 No dependencies');
    }
    
    if (blocking.length > 0) {
      console.log(`🚧 Blocking (${blocking.length}):`);
      blocking.forEach(blocked => {
        console.log(`  • ${blocked.name} (${blocked.status.name})`);
      });
    } else {
      console.log('🚧 Not blocking any features');
    }
    
    if (!validation.isValid) {
      console.warn('⚠️ Dependency conflicts:');
      validation.conflicts.forEach(conflict => {
        console.warn(`  • ${conflict}`);
      });
    } else {
      console.log('✅ Dependencies are valid');
    }
    
    console.groupEnd();
  };

  const handleAddDependency = (id: string) => {
    console.log(`🔗 Add dependency to feature: ${id}`);
    // In a real app, this would open a dialog to select dependencies
    
    // For demo purposes, show a summary of all dependencies
    const summary = getDependencySummary(features);
    console.group('📊 Dependency Summary');
    console.log(`📋 Total features: ${summary.totalFeatures}`);
    console.log(`🔗 Features with dependencies: ${summary.featuresWithDependencies}`);
    console.log(`📈 Total dependencies: ${summary.totalDependencies}`);
    
    if (summary.conflicts.length > 0) {
      console.warn(`⚠️ Conflicts found in ${summary.conflicts.length} features:`);
      summary.conflicts.forEach(({ feature, conflicts }) => {
        console.warn(`  • ${feature.name}: ${conflicts.join('; ')}`);
      });
    } else {
      console.log('✅ No dependency conflicts');
    }
    
    if (summary.cyclicDependency.hasCycle && summary.cyclicDependency.cycle) {
      console.warn('🔄 Cyclic dependency detected:');
      console.warn(`  Cycle: ${summary.cyclicDependency.cycle.join(' → ')}`);
    } else {
      console.log('✅ No cyclic dependencies');
    }
    
    console.groupEnd();
  };

  return (
    <GanttProvider
      className="rounded-none"
      onAddItem={handleAddFeature}
      range="monthly"
      zoom={100}
    >
      <GanttSidebar>
        {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
          <GanttSidebarGroup key={group} name={group}>
            {features.map((feature) => (
              <GanttSidebarItem
                feature={feature}
                key={feature.id}
                onSelectItem={handleViewFeature}
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttFeatureListGroup key={group}>
              {features.map((feature) => (
                <div className="flex" key={feature.id}>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        onClick={() => handleViewFeature(feature.id)}
                        type="button"
                      >
                        <GanttFeatureItem
                          onMove={handleMoveFeature}
                          {...feature}
                        >
                          <div className="flex items-center gap-1 flex-1">
                            {feature.dependencies?.length && (
                              <GitBranchIcon 
                                className="text-muted-foreground shrink-0" 
                                size={12}
                              />
                            )}
                            {(() => {
                              const validation = validateDependencies(feature, features);
                              return !validation.isValid && (
                                <AlertTriangleIcon 
                                  className="text-destructive shrink-0" 
                                  size={12}
                                />
                              );
                            })()}
                            <p className="flex-1 truncate text-xs">
                              {feature.name}
                            </p>
                          </div>
                          {feature.owner && (
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={feature.owner.image} />
                              <AvatarFallback>
                                {feature.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </GanttFeatureItem>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewFeature(feature.id)}
                      >
                        <EyeIcon className="text-muted-foreground" size={16} />
                        View feature
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleViewDependencies(feature.id)}
                      >
                        <GitBranchIcon className="text-muted-foreground" size={16} />
                        View dependencies
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleAddDependency(feature.id)}
                      >
                        <GitBranchIcon className="text-muted-foreground" size={16} />
                        Add dependency
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleCopyLink(feature.id)}
                      >
                        <LinkIcon className="text-muted-foreground" size={16} />
                        Copy link
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveFeature(feature.id)}
                      >
                        <TrashIcon size={16} />
                        Remove from roadmap
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        {exampleMarkers.map((marker) => (
          <GanttMarker
            key={marker.id}
            {...marker}
            onRemove={handleRemoveMarker}
          />
        ))}
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};

const earliestYear =
  exampleFeatures
    .map((feature) => feature.startAt.getFullYear())
    .sort()
    .at(0) ?? new Date().getFullYear();

const latestYear =
  exampleFeatures
    .map((feature) => feature.endAt.getFullYear())
    .sort()
    .at(-1) ?? new Date().getFullYear();

const CalendarView = () => (
  <CalendarProvider>
    <CalendarDate>
      <CalendarDatePicker>
        <CalendarMonthPicker />
        <CalendarYearPicker end={latestYear} start={earliestYear} />
      </CalendarDatePicker>
      <CalendarDatePagination />
    </CalendarDate>
    <CalendarHeader />
    <CalendarBody features={exampleFeatures}>
      {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
    </CalendarBody>
  </CalendarProvider>
);

const ListView = () => {
  const [features, setFeatures] = useState(exampleFeatures);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }

    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }

        return feature;
      })
    );
  };

  return (
    <ListProvider className="overflow-auto" onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <ListGroup id={status.name} key={status.name}>
          <ListHeader color={status.color} name={status.name} />
          <ListItems>
            {features
              .filter((feature) => feature.status.name === status.name)
              .map((feature, index) => (
                <ListItem
                  id={feature.id}
                  index={index}
                  key={feature.id}
                  name={feature.name}
                  parent={feature.status.name}
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <p className="m-0 flex-1 font-medium text-sm">
                    {feature.name}
                  </p>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </ListItem>
              ))}
          </ListItems>
        </ListGroup>
      ))}
    </ListProvider>
  );
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const KanbanView = () => {
  const [features, setFeatures] = useState(
    exampleFeatures.map((feature) => ({
      ...feature,
      column: feature.status.id,
    }))
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find(({ id }) => id === over.id);

    if (!status) {
      return;
    }

    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, status };
        }

        return feature;
      })
    );
  };

  return (
    <KanbanProvider
      className="p-4"
      columns={statuses}
      data={features}
      onDragEnd={handleDragEnd}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>{column.name}</KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                    <p className="m-0 text-muted-foreground text-xs">
                      {feature.initiative.name}
                    </p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{' '}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};

const TableView = () => {
  const columns: ColumnDef<(typeof exampleFeatures)[number]>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="size-6">
              <AvatarImage src={row.original.owner.image} />
              <AvatarFallback>
                {row.original.owner.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div
              className="absolute right-0 bottom-0 h-2 w-2 rounded-full ring-2 ring-background"
              style={{
                backgroundColor: row.original.status.color,
              }}
            />
          </div>
          <div>
            <span className="font-medium">{row.original.name}</span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <span>{row.original.product.name}</span>
              <ChevronRightIcon size={12} />
              <span>{row.original.group.name}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'startAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Start At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
        }).format(row.original.startAt),
    },
    {
      accessorKey: 'endAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="End At" />
      ),
      cell: ({ row }) =>
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
        }).format(row.original.endAt),
    },
    {
      id: 'release',
      accessorFn: (row) => row.release.id,
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Release" />
      ),
      cell: ({ row }) => row.original.release.name,
    },
  ];

  return (
    <div className="size-full overflow-auto">
      <TableProvider columns={columns} data={exampleFeatures}>
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
              {({ header }) => <TableHead header={header} key={header.id} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => (
            <TableRow key={row.id} row={row}>
              {({ cell }) => <TableCell cell={cell} key={cell.id} />}
            </TableRow>
          )}
        </TableBody>
      </TableProvider>
    </div>
  );
};

const Example = () => {
  const views = [
    {
      id: 'gantt',
      label: 'Gantt',
      icon: GanttChartSquareIcon,
      component: GanttView,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      component: CalendarView,
    },
    {
      id: 'list',
      label: 'List',
      icon: ListIcon,
      component: ListView,
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: KanbanSquareIcon,
      component: KanbanView,
    },
    {
      id: 'table',
      label: 'Table',
      icon: TableIcon,
      component: TableView,
    },
  ];

  return (
    <Tabs className="not-prose size-full gap-0 divide-y" defaultValue="gantt">
      <div className="flex items-center justify-between gap-4 p-4">
        <p className="font-medium">Roadmap</p>
        <TabsList>
          {views.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              <view.icon size={16} />
              <span className="sr-only">{view.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {views.map((view) => (
        <TabsContent className="overflow-hidden" key={view.id} value={view.id}>
          <view.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Example;
