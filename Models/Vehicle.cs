﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Fleet_Management_system.Models;

[Table("vehicles")]
public partial class Vehicle
{
    [Key]
    [Column("vehicleid")]
    public long Vehicleid { get; set; }

    [Column("vehiclenumber")]
    public long? Vehiclenumber { get; set; }

    [Column("vehicletype")]
    [StringLength(255)]
    public string? Vehicletype { get; set; }

    [InverseProperty("Vehicle")]
    public virtual ICollection<Routehistory> Routehistories { get; set; } = new List<Routehistory>();

    [InverseProperty("Vehicle")]
    public virtual ICollection<Vehiclesinformation> Vehiclesinformations { get; set; } = new List<Vehiclesinformation>();
}
